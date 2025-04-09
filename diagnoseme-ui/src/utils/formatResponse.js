import { Box, Typography, Alert } from "@mui/material";

const formatResponse = (response) => {
  if (typeof response !== "string") {
    console.error("formatResponse received a non-string value:", response);
    return <pre>{JSON.stringify(response, null, 2)}</pre>;
  }

  const sections = response.split("\n").filter((line) => line.trim() !== "");
  
  // Check if there's an alert in the response
  const hasAlert = sections.some(section => 
    section.toLowerCase().includes("**alert:") || section.toLowerCase().includes("**alert :")
  );

  return (
    <>
      {sections.map((section, index) => {
        if (section.toLowerCase().includes("**alert:") || section.toLowerCase().includes("**alert :")) {
          const alertText = section.replace(/\*\*alert:?\s*\*\*/i, "").trim();
          return (
            <Alert 
              key={`alert-${index}`} 
              severity="error" 
              variant="filled" 
              sx={{ mb: 2, fontWeight: "bold" }}
            >
              {alertText}
            </Alert>
          );
        }
        
        else if (section.toLowerCase().startsWith("**question**:")) {
          return (
            <Box key={`section-${index}`} sx={{ mb: 3, border: "1px solid #e0e0e0", p: 2, borderRadius: 1, backgroundColor: "#f5f5f5" }}>
              <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1, color: "#ff9800" }}>
                Question
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: "medium" }}>
                {section.replace(/\*\*question\*\*:\s*/i, "").trim()}
              </Typography>
            </Box>
          );
        }
        
        else if (section.toLowerCase().startsWith("**reason**:")) {
          return (
            <Box key={`section-${index}`} sx={{ mb: 3, ml: 3 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: "medium", mb: 0.5, color: "#ff9800" }}>
                Reason for Question
              </Typography>
              <Typography variant="body2" sx={{ fontStyle: "italic" }}>
                {section.replace(/\*\*reason\*\*:\s*/i, "").trim()}
              </Typography>
            </Box>
          );
        }
        
        else if (section.toLowerCase().startsWith("**impression**:")) {
          const impressionContent = section.replace(/\*\*impression\*\*:\s*/i, "").trim();
          const impressionItems = impressionContent.split("-").filter(item => item.trim() !== "");
          
          return (
            <Box key={`section-${index}`} sx={{ mb: 3, border: "1px solid #e0e0e0", p: 2, borderRadius: 1, backgroundColor: "#e8f4fd" }}>
              <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1, color: "#1976d2" }}>
                Impression
              </Typography>
              {impressionItems.length > 1 ? (
                <ul style={{ marginTop: 8, paddingLeft: 24 }}>
                  {impressionItems.map((item, i) => (
                    <li key={`impression-item-${i}`}>
                      <Typography variant="body1">{item.trim()}</Typography>
                    </li>
                  ))}
                </ul>
              ) : (
                <Typography variant="body1">{impressionContent}</Typography>
              )}
            </Box>
          );
        }
        
        else if (section.toLowerCase().startsWith("**key findings**:")) {
          const findingsContent = section.replace(/\*\*key findings\*\*:\s*/i, "").trim();
          const findingItems = findingsContent.split("-").filter(item => item.trim() !== "");
          
          return (
            <Box key={`section-${index}`} sx={{ mb: 3, border: "1px solid #e0e0e0", p: 2, borderRadius: 1 }}>
              <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1, color: "#4caf50" }}>
                Key Findings
              </Typography>
              <ul style={{ marginTop: 8, paddingLeft: 24 }}>
                {findingItems.map((item, i) => (
                  <li key={`finding-${i}`}>
                    <Typography variant="body1">{item.trim()}</Typography>
                  </li>
                ))}
              </ul>
            </Box>
          );
        }
        
        else if (section.toLowerCase().startsWith("**recommendations**:")) {
          const recommendationsContent = section.replace(/\*\*recommendations\*\*:\s*/i, "").trim();
          const recommendationItems = recommendationsContent.split("-").filter(item => item.trim() !== "");
          
          return (
            <Box key={`section-${index}`} sx={{ mb: 3, border: "1px solid #e0e0e0", p: 2, borderRadius: 1, backgroundColor: "#f9f9f9" }}>
              <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1, color: "#673ab7" }}>
                Recommendations
              </Typography>
              <ul style={{ marginTop: 8, paddingLeft: 24 }}>
                {recommendationItems.map((item, i) => (
                  <li key={`recommendation-${i}`}>
                    <Typography variant="body1">{item.trim()}</Typography>
                  </li>
                ))}
              </ul>
            </Box>
          );
        }
        
        // Any other content
        else {
          // Skip if this is empty or just whitespace
          if (!section.trim()) return null;
          
          return (
            <Typography key={`other-${index}`} variant="body1" sx={{ mb: 2 }}>
              {section}
            </Typography>
          );
        }
      })}
    </>
  );
};

export default formatResponse;
