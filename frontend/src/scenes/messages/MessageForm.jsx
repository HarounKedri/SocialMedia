import { Box, TextField, Button } from "@mui/material";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addMessage, updateMessageWithId, removeOptimisticMessage } from "state";

const MessageForm = ({ receiverId }) => {
  const [message, setMessage] = useState("");
  const dispatch = useDispatch();
  const token = useSelector((state) => state.token);
  const loggedInUserId = useSelector((state) => state.user._id);
  const [sendingMessage, setSendingMessage] = useState(false); // Track sending state

  const handleSendMessage = async () => {
    const newMessage = {
      senderId: loggedInUserId,
      receiverId,
      content: message,
      createdAt: new Date().toISOString(),
    };

    // Optimistically update the message list
    dispatch(addMessage(newMessage));

    try {
      setSendingMessage(true); // Set sending state to true
      const response = await fetch("http://localhost:3001/messages", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newMessage),
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      const savedMessage = await response.json();
      dispatch(updateMessageWithId({ ...newMessage, _id: savedMessage._id })); // Update the message with the server-provided ID
    } catch (error) {
      console.error("Error sending message:", error);
      dispatch(removeOptimisticMessage(newMessage)); // Rollback the optimistic update if sending fails
    } finally {
      setSendingMessage(false); // Reset sending state
    }

    setMessage("");
  };

  return (
    <Box display="flex" mt="1rem">
      <TextField
        variant="outlined"
        label="Type a message..."
        fullWidth
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        disabled={sendingMessage} // Disable input while sending
      />
      <Button variant="contained" color="primary" onClick={handleSendMessage} disabled={sendingMessage}>
        Send
      </Button>
    </Box>
  );
};

export default MessageForm;
