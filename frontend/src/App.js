import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom";
import HomePage from "scenes/homePage";
import LoginPage from "scenes/loginPage";
import ProfilePage from "scenes/profilePage";
import MessagesPage from "scenes/messages/MessagesPage";
import MessagesOverviewPage from "scenes/messages/MessagesOverviewPage";
import Navbar from "scenes/navbar";
import { useMemo, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { CssBaseline, ThemeProvider, Box } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { themeSettings } from "./theme";
import { setUsers } from "state";

function App() {
  const mode = useSelector((state) => state.mode);
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);
  const isAuth = Boolean(useSelector((state) => state.token));
  const dispatch = useDispatch();
  const token = useSelector((state) => state.token);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("http://localhost:3001/users", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        dispatch(setUsers({ users: data }));
      } catch (err) {
        console.error("Failed to fetch users:", err);
      }
    };

    if (isAuth) {
      fetchUsers();
    }
  }, [dispatch, token, isAuth]);

  return (
    <div className="app">
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          {isAuth && <Navbar />} {/* Conditionally render Navbar */}
          <Box mt={isAuth ? "64px" : "0"}> {/* Add margin top only if Navbar is rendered */}
            <Routes>
              <Route path="/" element={<LoginPage />} />
              <Route
                path="/home"
                element={isAuth ? <HomePage /> : <Navigate to="/" />}
              />
              <Route
                path="/profile/:userId"
                element={isAuth ? <ProfilePage /> : <Navigate to="/" />}
              />
              <Route
                path="/messages"
                element={isAuth ? <MessagesOverviewPage /> : <Navigate to="/" />}
              />
              <Route
                path="/messages/:receiverId"
                element={isAuth ? <MessagesPage /> : <Navigate to="/" />}
              />
            </Routes>
          </Box>
        </ThemeProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
