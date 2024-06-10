import { useState, useEffect } from "react";
import {
  Box,
  IconButton,
  InputBase,
  Typography,
  Select,
  MenuItem,
  FormControl,
  useTheme,
  useMediaQuery,
  CircularProgress,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Badge,
  Menu
} from "@mui/material";
import {
  Search,
  Message,
  DarkMode,
  LightMode,
  Help,
  Menu as MenuIcon,
  Close,
  Notifications as NotificationsIcon
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { setMode, setLogout } from "state";
import { useNavigate } from "react-router-dom";
import FlexBetween from "components/FlexBetween";

const Navbar = () => {
  const [isMobileMenuToggled, setIsMobileMenuToggled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [notificationLoading, setNotificationLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const token = useSelector((state) => state.token);
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");

  const theme = useTheme();
  const neutralLight = theme.palette.neutral.light;
  const dark = theme.palette.neutral.dark;
  const background = theme.palette.background.default;
  const primaryLight = theme.palette.primary.light;
  const alt = theme.palette.background.alt;

  const fullName = user ? `${user.firstName} ${user.lastName}` : "";

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!searchQuery) {
        setSearchResults([]);
        return;
      }

      setIsLoading(true);

      try {
        const response = await fetch(`http://localhost:3001/users/search/${searchQuery}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        setSearchResults(data);
      } catch (err) {
        console.error("Failed to fetch search results:", err);
      } finally {
        setIsLoading(false);
      }
    };

    const debounceFetch = setTimeout(() => {
      fetchSearchResults();
    }, 300);

    return () => clearTimeout(debounceFetch);
  }, [searchQuery, token]);

  useEffect(() => {
    const fetchNotifications = async () => {
      setNotificationLoading(true);
      try {
        const response = await fetch(`http://localhost:3001/messages/notifications/${user._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        setNotifications(data);
      } catch (err) {
        console.error("Failed to fetch notifications:", err);
      } finally {
        setNotificationLoading(false);
      }
    };

    if (user) {
      fetchNotifications();
    }
  }, [user, token]);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleProfileClick = (userId) => {
    navigate(`/profile/${userId}`);
    setSearchQuery("");
    setSearchResults([]);
  };

  const handleNotificationClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleNotificationClose = () => {
    setAnchorEl(null);
  };

  const handleNavigateToMessage = (conversationId) => {
    navigate(`/messages/${conversationId}`);
    handleNotificationClose();
  };

  return (
    <Box position="fixed" top="0" width="100%" zIndex="1000" backgroundColor={alt}>
      <FlexBetween padding="1rem 6%" backgroundColor={alt}>
        <FlexBetween gap="1.75rem">
          <Typography
            fontWeight="bold"
            fontSize="clamp(1rem, 2rem, 2.25rem)"
            color="primary"
            onClick={() => navigate("/home")}
            sx={{
              "&:hover": {
                color: primaryLight,
                cursor: "pointer",
              },
            }}
          >
            FaceTN
          </Typography>
          {isNonMobileScreens && (
            <Box position="relative">
              <FlexBetween
                backgroundColor={neutralLight}
                borderRadius="9px"
                gap="3rem"
                padding="0.1rem 1.5rem"
              >
                <InputBase placeholder="Search..." value={searchQuery} onChange={handleSearchChange} />
                <IconButton>
                  <Search />
                </IconButton>
              </FlexBetween>
              {searchQuery && (
                <Box
                  position="absolute"
                  top="100%"
                  left="0"
                  width="100%"
                  maxHeight="300px"
                  overflow="auto"
                  bgcolor={background}
                  borderRadius="9px"
                  boxShadow="0px 4px 12px rgba(0, 0, 0, 0.1)"
                  zIndex="1001"
                >
                  {isLoading ? (
                    <Box display="flex" justifyContent="center" p="1rem">
                      <CircularProgress />
                    </Box>
                  ) : (
                    <List>
                      {searchResults.map((result) => (
                        <ListItem button onClick={() => handleProfileClick(result._id)} key={result._id}>
                          <ListItemAvatar>
                            <Avatar src={`http://localhost:3001/assets/${result.picturePath}`} />
                          </ListItemAvatar>
                          <ListItemText primary={`${result.firstName} ${result.lastName}`} />
                        </ListItem>
                      ))}
                    </List>
                  )}
                </Box>
              )}
            </Box>
          )}
        </FlexBetween>

        {/* DESKTOP NAV */}
        {isNonMobileScreens ? (
          <FlexBetween gap="2rem">
            <IconButton onClick={() => dispatch(setMode())}>
              {theme.palette.mode === "dark" ? (
                <DarkMode sx={{ fontSize: "25px" }} />
              ) : (
                <LightMode sx={{ color: dark, fontSize: "25px" }} />
              )}
            </IconButton>
            <IconButton onClick={() => navigate("/messages")}>
              <Message sx={{ fontSize: "25px" }} />
            </IconButton>
            <IconButton color="inherit" onClick={handleNotificationClick}>
              <Badge badgeContent={notifications.length} color="error">
                <NotificationsIcon sx={{ fontSize: "25px" }} />
              </Badge>
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              keepMounted
              open={Boolean(anchorEl)}
              onClose={handleNotificationClose}
            >
              {notificationLoading ? (
                <MenuItem>
                  <CircularProgress size={24} />
                </MenuItem>
              ) : notifications.length > 0 ? (
                notifications.map((notification) => (
                  <MenuItem key={notification._id} onClick={() => handleNavigateToMessage(notification.conversationId)}>
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
            <Help sx={{ fontSize: "25px" }} />
            {user && (
              <FormControl variant="standard" value={fullName}>
                <Select
                  value={fullName}
                  sx={{
                    backgroundColor: neutralLight,
                    width: "150px",
                    borderRadius: "0.25rem",
                    p: "0.25rem 1rem",
                    "& .MuiSvgIcon-root": {
                      pr: "0.25rem",
                      width: "3rem",
                    },
                    "& .MuiSelect-select:focus": {
                      backgroundColor: neutralLight,
                    },
                  }}
                  input={<InputBase />}
                >
                  <MenuItem value={fullName}>
                    <Typography>{fullName}</Typography>
                  </MenuItem>
                  <MenuItem onClick={() => dispatch(setLogout())}>Log Out</MenuItem>
                </Select>
              </FormControl>
            )}
          </FlexBetween>
        ) : (
          <IconButton
            onClick={() => setIsMobileMenuToggled(!isMobileMenuToggled)}
          >
            <MenuIcon />
          </IconButton>
        )}

        {/* MOBILE NAV */}
        {!isNonMobileScreens && isMobileMenuToggled && (
          <Box
            position="fixed"
            right="0"
            bottom="0"
            height="100%"
            zIndex="10"
            maxWidth="500px"
            minWidth="300px"
            backgroundColor={background}
          >
            {/* CLOSE ICON */}
            <Box display="flex" justifyContent="flex-end" p="1rem">
              <IconButton
                onClick={() => setIsMobileMenuToggled(!isMobileMenuToggled)}
              >
                <Close />
              </IconButton>
            </Box>

            {/* MENU ITEMS */}
            <FlexBetween
              display="flex"
              flexDirection="column"
              justifyContent="center"
              alignItems="center"
              gap="3rem"
            >
              <IconButton
                onClick={() => dispatch(setMode())}
                sx={{ fontSize: "25px" }}
              >
                {theme.palette.mode === "dark" ? (
                  <DarkMode sx={{ fontSize: "25px" }} />
                ) : (
                  <LightMode sx={{ color: dark, fontSize: "25px" }} />
                )}
              </IconButton>
              <IconButton onClick={() => navigate("/messages")}>
                <Message sx={{ fontSize: "25px" }} />
              </IconButton>
              <IconButton color="inherit" onClick={handleNotificationClick}>
                <Badge badgeContent={notifications.length} color="error">
                  <NotificationsIcon sx={{ fontSize: "25px" }} />
                </Badge>
              </IconButton>
              <Help sx={{ fontSize: "25px" }} />
              {user && (
                <FormControl variant="standard" value={fullName}>
                  <Select
                    value={fullName}
                    sx={{
                      backgroundColor: neutralLight,
                      width: "150px",
                      borderRadius: "0.25rem",
                      p: "0.25rem 1rem",
                      "& .MuiSvgIcon-root": {
                        pr: "0.25rem",
                        width: "3rem",
                      },
                      "& .MuiSelect-select:focus": {
                        backgroundColor: neutralLight,
                      },
                    }}
                    input={<InputBase />}
                  >
                    <MenuItem value={fullName}>
                      <Typography>{fullName}</Typography>
                    </MenuItem>
                    <MenuItem onClick={() => dispatch(setLogout())}>
                      Log Out
                    </MenuItem>
                  </Select>
                </FormControl>
              )}
            </FlexBetween>
          </Box>
        )}
      </FlexBetween>
    </Box>
  );
};

export default Navbar;
