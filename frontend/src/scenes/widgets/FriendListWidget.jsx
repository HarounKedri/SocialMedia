import { Box, Typography, useTheme } from "@mui/material";
import WidgetWrapper from "components/WidgetWrapper";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setFriends } from "state";
import Friend from "components/Friend"; // Updated import path

const FriendListWidget = ({ userId }) => {
  const dispatch = useDispatch();
  const { palette } = useTheme();
  const token = useSelector((state) => state.token);
  const friends = useSelector((state) => state.user?.friends || []);
  const currentUserId = useSelector((state) => state.user._id);

  const getFriends = async () => {
    try {
      const response = await fetch(`http://localhost:3001/users/${userId}/friends`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (response.ok) {
        dispatch(setFriends({ friends: data }));
      } else {
        console.error(data.message);
      }
    } catch (error) {
      console.error("Failed to fetch friends:", error);
    }
  };

  const handleAddRemoveFriend = async (friendId) => {
    try {
      const response = await fetch(`http://localhost:3001/users/${userId}/${friendId}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      if (response.ok) {
        dispatch(setFriends({ friends: data }));
      } else {
        console.error(data.message);
      }
    } catch (error) {
      console.error("Failed to update friends list:", error);
    }
  };

  useEffect(() => {
    getFriends();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (!Array.isArray(friends)) {
    return <Typography>Loading...</Typography>; // Handle case where friends is not an array
  }

  return (
    <WidgetWrapper>
      <Typography
        color={palette.neutral.dark}
        variant="h5"
        fontWeight="500"
        sx={{ mb: "1.5rem" }}
      >
        Friend List
      </Typography>
      <Box display="flex" flexDirection="column" gap="1.5rem">
        {friends.map((friend) => (
          <Friend
            key={friend._id}
            friendId={friend._id}
            name={`${friend.firstName} ${friend.lastName}`}
            subtitle={friend.occupation}
            userPicturePath={friend.picturePath}
            onAddRemoveFriend={handleAddRemoveFriend}
            isFriend={friends.some((f) => f._id === friend._id)}
            isCurrentUser={friend._id === currentUserId} // Pass down whether the friend is the current user
          />
        ))}
      </Box>
    </WidgetWrapper>
  );
};

export default FriendListWidget;
