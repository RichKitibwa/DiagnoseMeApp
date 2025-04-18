import json
import os
import numpy as np
import boto3
import shutil
import tarfile
import faiss
import time
from langchain_community.vectorstores import FAISS
from langchain.embeddings.base import Embeddings
from langchain.schema import Document
from langchain_community.docstore.in_memory import InMemoryDocstore
from typing import List
from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()

# get openai API key
api_key = os.getenv("OPENAI_API_KEY") 
client = OpenAI(api_key=api_key)

AWS_S3_BUCKET = os.getenv("AWS_S3_BUCKET")
VECTORSTORE_S3_PREFIX = "output/vectorstore/"
EMBEDDINGS_S3_PREFIX = "output/"

class OpenAIEmbeddingFunction(Embeddings):
    def __init__(self, model: str = "text-embedding-3-large"):
        self.model = model

    def embed_query(self, text: str) -> List[float]:
        response = client.embeddings.create(input=[text], model=self.model)
        return self.normalize_l2(response.data[0].embedding)
    
    def embed_documents(self, texts: List[str]) -> List[List[float]]:
        raise NotImplementedError("Document embeddings are precomputed and not supported in this function.")
    
    def __call__(self, input: List[str]) -> List[List[float]]:
        """Make the class callable, defaulting to embedding a query."""
        return self.embed_query(input)

    @staticmethod
    def normalize_l2(embedding: List[float]) -> List[float]:
        norm = np.linalg.norm(embedding)
        if norm == 0:
            return embedding
        return embedding / norm

embed_fn = OpenAIEmbeddingFunction()

def create_vectorstore():
    """Create FAISS vector store using already-embedded data from S3."""
    try:
        print("Fetching processed files from S3...")
        s3 = boto3.client("s3")

        # List all JSON files in the output/ folder
        response = s3.list_objects_v2(Bucket=AWS_S3_BUCKET, Prefix=EMBEDDINGS_S3_PREFIX)
        files = [obj["Key"] for obj in response.get("Contents", []) if obj["Key"].endswith(".json")]

        texts = []
        embeddings = []
        metadatas = []

        # Process each JSON file
        for file_key in files:
            obj = s3.get_object(Bucket=AWS_S3_BUCKET, Key=file_key)
            data = json.load(obj["Body"])

            for record in data:
                text = record.get("text", "").strip()
                metadata = record.get("metadata", {})
                embedding = record.get("embeddings")

                if text and len(text) > 20 and embedding:
                    texts.append(text)
                    metadatas.append(metadata)
                    embeddings.append(embedding)

        if not texts or not embeddings:
            raise ValueError("No valid documents or embeddings found.")        

        # Convert embeddings to a NumPy array
        embeddings_np = np.array(embeddings, dtype=np.float32)

        # Create FAISS index 
        dimension = embeddings_np.shape[1]  # Get embedding dimension
        index = faiss.IndexFlatL2(dimension)
        index.add(embeddings_np)

        # Create sequential IDs and docstore
        docstore = {}
        index_to_docstore_id = {}
        
        for i in range(len(texts)):
            doc_id = f"doc_{i}"
            docstore[doc_id] = Document(
                page_content=texts[i],
                metadata=metadatas[i]
            )
            index_to_docstore_id[i] = doc_id

        # Create FAISS vector store
        print("Creating FAISS vector store...")
        vectorstore = FAISS(
            embedding_function=embed_fn,
            index=index,
            docstore=InMemoryDocstore(docstore),
            index_to_docstore_id=index_to_docstore_id
        )

        # Save and upload vector store to S3
        print(f"Created vectorstore with {len(docstore)} documents")
        upload_vectorstore_to_s3(vectorstore)
        return vectorstore
    
    except Exception as e:
        print(f"Error creating vector store: {e}")

def upload_vectorstore_to_s3(vectorstore: FAISS):
    """Upload FAISS vector store files to S3."""
    try:
        s3 = boto3.client("s3")

        # Create a temporary directory to save vector store
        temp_dir = "/tmp/vectorstore"
        shutil.rmtree(temp_dir, ignore_errors=True)  # Clean up if it already exists
        os.makedirs(temp_dir, exist_ok=True)

        # Save vector store to the temporary directory
        vectorstore.save_local(temp_dir)

        # Compress the directory
        compressed_file = "/tmp/vectorstore.tar.gz"
        with tarfile.open(compressed_file, "w:gz") as tar:
            tar.add(temp_dir, arcname=".")

        # Upload the compressed file to S3
        s3.upload_file(
            Filename=compressed_file,
            Bucket=AWS_S3_BUCKET,
            Key=VECTORSTORE_S3_PREFIX + "vectorstore.tar.gz",
        )

        print("Vector store uploaded successfully to S3.")
    except Exception as e:
        print(f"Error uploading vector store to S3: {e}")

def load_vectorstore_from_s3():
    """Load the FAISS vector store directly from S3."""
    try:
        print("Loading vector store from S3...")
        s3 = boto3.client("s3")

        # Download the compressed vector store
        compressed_file = "/tmp/vectorstore.tar.gz"
        s3.download_file(
            Bucket=AWS_S3_BUCKET,
            Key=VECTORSTORE_S3_PREFIX + "vectorstore.tar.gz",
            Filename=compressed_file,
        )

        # Extract the compressed file
        temp_dir = "/tmp/vectorstore"
        shutil.rmtree(temp_dir, ignore_errors=True)  # Clean up if it already exists
        with tarfile.open(compressed_file, "r:gz") as tar:
            tar.extractall(path=temp_dir)

        # Load the vector store
        vectorstore = FAISS.load_local(temp_dir, embeddings=embed_fn, allow_dangerous_deserialization=True)
        print("Vector store loaded successfully from S3.")
        return vectorstore
    except Exception as e:
        print(f"Error loading vector store from S3: {e}")
        return None
    
def retrieve_context(query: str, retriever) -> str:
    query = ' '.join(query.split())
    try:
        # Expand query to encourage broader retrieval across medical specialties
        expanded_query = f"Medical analysis considering multiple specialties for: {query}"
        
        print(f"DEBUG - Original query: {query}")
        print(f"DEBUG - Expanded query: {expanded_query}")
        
        # Use expanded query for retrieval
        results = retriever.invoke(expanded_query)
        
        if not results:
            print("DEBUG - No relevant documents found in retrieval")
            return "No relevant documents found. Consider possibilities across all medical specialties including infectious diseases, cardiology, endocrinology, neurology, gastroenterology, and more."
            
        # Combine results with source tracking
        contexts = []
        
        print(f"DEBUG - Retrieved {len(results)} documents")
        
        for i, doc in enumerate(results):
            source = doc.metadata.get('filename', 'Unknown source')
            contexts.append(f"From {source}:\n{doc.page_content}\n")
            print(f"DEBUG - Document {i+1}: From {source}, First 100 chars: {doc.page_content[:100]}...")
            
        result_context = "\n".join(contexts)
        print(f"DEBUG - Total context length: {len(result_context)} characters")
        
        return result_context
        
    except Exception as e:
        print(f"Retrieval error: {e}")
        raise
    