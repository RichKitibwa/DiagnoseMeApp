import { Box, Typography } from "@mui/material";

const formatResponse = (response) => {

    if (typeof response !== "string") {
    console.error("formatResponse received a non-string value:", response);
    return response = JSON.stringify(response, null, 2);;
    }

  const sections = response.split("\n").filter((line) => line.trim() !== "");

  return sections.map((section, index) => {
    if (section.startsWith("**Assessment**:")) {
      return (
        <Box key={`section-${index}`} sx={{ marginBottom: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: "bold", marginBottom: 1 }}>
            Assessment
          </Typography>
          <Typography variant="body1">{section.replace("**Assessment**:", "").trim()}</Typography>
        </Box>
      );
    } else if (section.startsWith("**Key Findings**:")) {
      return (
        <Box key={`section-${index}`} sx={{ marginBottom: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: "bold", marginBottom: 1 }}>
            Key Findings
          </Typography>
          <ul>
            {section
              .replace("**Key Findings**:", "")
              .split("-")
              .filter((item) => item.trim() !== "")
              .map((item, i) => (
                <li key={`key-finding-${i}`}>
                  <Typography variant="body1">{item.trim()}</Typography>
                </li>
              ))}
          </ul>
        </Box>
      );
    } else if (section.startsWith("**Question**:")) {
      return (
        <Box key={`section-${index}`} sx={{ marginBottom: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: "bold", marginBottom: 1 }}>
            Question
          </Typography>
          <Typography variant="body1">{section.replace("**Question**:", "").trim()}</Typography>
        </Box>
      );
    } else if (section.startsWith("**Next Steps**:")) {
      return (
        <Box key={`section-${index}`} sx={{ marginBottom: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: "bold", marginBottom: 1 }}>
            Next Steps
          </Typography>
          <ul>
            {section
              .replace("**Next Steps**:", "")
              .split("-")
              .filter((item) => item.trim() !== "")
              .map((item, i) => (
                <li key={`next-step-${i}`}>
                  <Typography variant="body1">{item.trim()}</Typography>
                </li>
              ))}
          </ul>
        </Box>
      );
    } else {
      return (
        <Typography key={`other-${index}`} variant="body1" sx={{ marginBottom: 2 }}>
          {section}
        </Typography>
      );
    }
  });
};

export default formatResponse;
