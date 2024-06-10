import { useState, useEffect } from "react";
import { Box, IconButton, Badge, Menu, MenuItem, Typography, CircularProgress } from "@mui/material";
import { Notifications as NotificationsIcon } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const Notifications = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const userId = useSelector((state) => state.user._id);
  const token = useSelector((state) => state.token);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNotifications = async () => {
      setLoading(true);
      try {
        const response = await fetch(`http://localhost:3001/messages/notifications/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        setNotifications(data);
      } catch (err) {
        console.error("Failed to fetch notifications:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [userId, token]);

  const handleNotificationClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNavigate = (conversationId) => {
    navigate(`/messages/${conversationId}`);
    handleClose();
  };

  return (
    <Box>
      <IconButton onClick={handleNotificationClick} color="inherit">
        <Badge badgeContent={notifications.length} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {loading ? (
          <MenuItem>
            <CircularProgress size={24} />
          </MenuItem>
        ) : notifications.length > 0 ? (
          notifications.map((notification) => (
            <MenuItem key={notification._id} onClick={() => handleNavigate(notification.conversationId)}>
              <Typography variant="body1">
                New message from {notification.senderId.firstName} {notification.senderId.lastName}
              </Typography>
            </MenuItem>
          ))
        ) : (
          <MenuItem>
            <Typography variant="body1">No new messages</Typography>
          </MenuItem>
        )}
      </Menu>
    </Box>
  );
};

export default Notifications;
