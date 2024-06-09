import React, { useEffect, useState } from "react";
import { Box, Typography, List, ListItem, ListItemText, ListItemAvatar, Avatar, Divider } from "@mui/material";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const MessagesOverviewPage = () => {
  const [friends, setFriends] = useState([]);
  const token = useSelector((state) => state.token);
  const userId = useSelector((state) => state.user._id);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const response = await fetch(`http://localhost:3001/users/${userId}/friends`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        setFriends(data);
      } catch (err) {
        console.error("Failed to fetch friends:", err);
      }
    };

    fetchFriends();
  }, [token, userId]);

  const handleStartConversation = (friendId) => {
    navigate(`/messages/${friendId}`);
  };

  return (
    <Box padding="2rem">
      <Typography variant="h4" gutterBottom>
        Select a conversation to start chatting
      </Typography>
      <List>
        {friends.map((friend) => (
          <React.Fragment key={friend._id}>
            <ListItem button onClick={() => handleStartConversation(friend._id)}>
              <ListItemAvatar>
                <Avatar src={`http://localhost:3001/assets/${friend.picturePath}`} />
              </ListItemAvatar>
              <ListItemText primary={`${friend.firstName} ${friend.lastName}`} secondary={friend.occupation} />
            </ListItem>
            <Divider component="li" />
          </React.Fragment>
        ))}
      </List>
    </Box>
  );
};

export default MessagesOverviewPage;
