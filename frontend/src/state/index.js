import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  mode: "light",
  user: null,
  token: null,
  posts: [],
  messages: [], // Add messages to the initial state
  users: [],
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setMode: (state) => {
      state.mode = state.mode === "light" ? "dark" : "light";
    },
    setLogin: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    setLogout: (state) => {
      state.user = null;
      state.token = null;
      state.posts = [];
      state.messages = []; // Clear messages on logout
      state.users = []; // Clear users on logout
    },
    setFriends: (state, action) => {
      if (state.user) {
        state.user.friends = action.payload.friends;
      } else {
        console.error("user friends non-existent :(");
      }
    },
    setPosts: (state, action) => {
      state.posts = action.payload.posts;
    },
    setPost: (state, action) => {
      const updatedPosts = state.posts.map((post) => {
        if (post._id === action.payload.post._id) return action.payload.post;
        return post;
      });
      state.posts = updatedPosts;
    },
    addPost: (state, action) => {
      state.posts.unshift(action.payload.post);
    },
    removePost: (state, action) => {
      state.posts = state.posts.filter((post) => post._id !== action.payload.postId);
    },
    updatePostLikes: (state, action) => {
      const updatedPosts = state.posts.map((post) => {
        if (post._id === action.payload.postId) {
          return { ...post, likes: action.payload.likes };
        }
        return post;
      });
      state.posts = updatedPosts;
    },
    setUsers: (state, action) => {
      state.users = action.payload.users;
    },
    setMessages: (state, action) => {
      state.messages = action.payload.messages;
    },
    addMessage: (state, action) => {
      state.messages.push(action.payload);
    },
    updateMessageWithId: (state, action) => {
      const index = state.messages.findIndex(
        (message) =>
          message.senderId === action.payload.senderId &&
          message.receiverId === action.payload.receiverId &&
          message.createdAt === action.payload.createdAt
      );
      if (index !== -1) {
        state.messages[index] = action.payload;
      }
    },
    removeOptimisticMessage: (state, action) => {
      state.messages = state.messages.filter(
        (message) =>
          message.senderId !== action.payload.senderId ||
          message.receiverId !== action.payload.receiverId ||
          message.createdAt !== action.payload.createdAt
      );
    },
  },
});

export const {
  setMode,
  setLogin,
  setLogout,
  setFriends,
  setPosts,
  setPost,
  addPost,
  removePost,
  updatePostLikes,
  setUsers,
  setMessages,
  addMessage,
  updateMessageWithId,
  removeOptimisticMessage,
} = authSlice.actions;
export default authSlice.reducer;
