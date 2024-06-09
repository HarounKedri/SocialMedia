import { Box, IconButton, Typography } from "@mui/material";
import { PersonAdd, PersonRemove } from "@mui/icons-material";

const Friend = ({ friendId, name, subtitle, userPicturePath, onAddRemoveFriend, isFriend, isCurrentUser }) => {
  const handleClick = () => {
    onAddRemoveFriend(friendId);
  };

  const defaultPicture = "/backend/public/assets"; // Replace with your default image path
  const pictureUrl = userPicturePath ? `http://localhost:3001/assets/${userPicturePath}` : defaultPicture;

  return (
    <Box display="flex" justifyContent="space-between" alignItems="center">
      <Box display="flex" alignItems="center" gap="1rem">
        <img
          src={pictureUrl}
          alt={name}
          style={{ width: 40, height: 40, borderRadius: "50%" }}
        />
        <Box>
          <Typography variant="h6">{name}</Typography>
          <Typography variant="subtitle2">{subtitle}</Typography>
        </Box>
      </Box>
      {!isCurrentUser && ( // Only show the button if this is not the current user
        <IconButton onClick={handleClick}>
          {isFriend ? <PersonRemove /> : <PersonAdd />}
        </IconButton>
      )}
    </Box>
  );
};

export default Friend;
