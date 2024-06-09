import { Box, Typography } from "@mui/material";

const MessageComponent = ({ message, isOwnMessage }) => {
  return (
    <Box
      display="flex"
      justifyContent={isOwnMessage ? "flex-end" : "flex-start"}
      m="0.5rem"
    >
      <Box
        padding="0.5rem"
        borderRadius="10px"
        bgcolor={isOwnMessage ? "primary.main" : "grey.300"}
        color={isOwnMessage ? "white" : "black"}
      >
        <Typography>{message.content}</Typography>
      </Box>
    </Box>
  );
};

export default MessageComponent;
