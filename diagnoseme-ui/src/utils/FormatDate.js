export const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    
    try {
        const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' };
        const date = new Date(dateString);
        
        // Check if date is valid
        if (isNaN(date.getTime())) {
            return "N/A";
        }
        
        return date.toLocaleDateString('en-US', options).replace(/(\d{2})\/(\d{2})\/(\d{4}),/, '$3-$1-$2');
    } catch (error) {
        console.error("Error formatting date:", error);
        return "N/A";
    }
}
