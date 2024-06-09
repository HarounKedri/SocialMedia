import { Box } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import MessageComponent from "./MessageComponent";
import { setMessages } from "state"; // Import the setMessages action

const MessageList = ({ receiverId }) => {
  const messages = useSelector((state) => state.messages);
  const token = useSelector((state) => state.token);
  const loggedInUserId = useSelector((state) => state.user._id);
  const dispatch = useDispatch(); // Get dispatch function

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch(`http://localhost:3001/messages/${loggedInUserId}/${receiverId}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        dispatch(setMessages({ messages: data })); // Dispatch the setMessages action
      } catch (err) {
        console.error("Failed to fetch messages:", err);
      }
    };

    fetchMessages();
  }, [loggedInUserId, receiverId, token, dispatch]);

  const filteredMessages = messages.filter(
    (message) =>
      (message.senderId === loggedInUserId && message.receiverId === receiverId) ||
      (message.senderId === receiverId && message.receiverId === loggedInUserId)
  );

  return (
    <Box>
      {filteredMessages.map((message) => (
        <MessageComponent
          key={message._id || message.createdAt}
          message={message}
          isOwnMessage={message.senderId === loggedInUserId}
        />
      ))}
    </Box>
  );
};

export default MessageList;
