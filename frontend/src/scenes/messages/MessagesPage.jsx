import { Box, Typography, Button } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import MessageList from "./MessageList";
import MessageForm from "./MessageForm";
import { setMessages } from "state"; // Import the setMessages action

const MessagesPage = () => {
  const { receiverId } = useParams();
  const users = useSelector((state) => state.users);
  const token = useSelector((state) => state.token);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const loggedInUserId = useSelector((state) => state.user._id);
  const receiver = users ? users.find((user) => user._id === receiverId) : null;

  if (!receiver) {
    return (
      <Box padding="2rem">
        <Typography variant="h4" gutterBottom>
          User not found
        </Typography>
      </Box>
    );
  }

  const handleDeleteConversation = async () => {
    try {
      const response = await fetch(`http://localhost:3001/messages/${loggedInUserId}/${receiverId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        dispatch(setMessages({ messages: [] }));
        navigate("/messages");
      } else {
        console.error("Failed to delete conversation");
      }
    } catch (error) {
      console.error("Error deleting conversation:", error);
    }
  };

  return (
    <Box padding="2rem">
      <Typography variant="h4" gutterBottom>
        Chat with {receiver.firstName} {receiver.lastName}
      </Typography>
      <Button
        variant="contained"
        color="secondary"
        onClick={handleDeleteConversation}
        style={{ marginBottom: "1rem" }}
      >
        Delete Conversation
      </Button>
      <MessageList receiverId={receiverId} />
      <MessageForm receiverId={receiverId} />
    </Box>
  );
};

export default MessagesPage;
