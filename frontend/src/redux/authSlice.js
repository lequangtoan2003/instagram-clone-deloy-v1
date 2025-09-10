import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    suggestedUsers: [],
    userProfile: null,
    selectedUser: null,
  },
  reducers: {
    setAuthUser: (state, action) => {
      state.user = action.payload;
    },
    setSuggestedUsers: (state, action) => {
      state.suggestedUsers = action.payload;
    },
    setUserProfile: (state, action) => {
      state.userProfile = action.payload;
    },
    setSelectedUser: (state, action) => {
      state.selectedUser = action.payload;
    },
    updateFollowStatus: (state, action) => {
      const { userId, targetUserId, isFollowing } = action.payload;
      if (isFollowing) {
        // Unfollow: delete
        state.user.following = state.user.following.filter(
          (id) => id !== targetUserId
        );
        if (state.userProfile && state.userProfile._id === targetUserId) {
          state.userProfile.followers = state.userProfile.followers.filter(
            (id) => id !== userId
          );
        }
      } else {
        // Follow: add
        state.user.following.push(targetUserId);
        if (state.userProfile && state.userProfile._id === targetUserId) {
          state.userProfile.followers.push(userId);
        }
      }
    },
    toggleBookmark: (state, action) => {
      const postId = action.payload;
      if (state.user && Array.isArray(state.user.bookmarks)) {
        if (state.user.bookmarks.includes(postId)) {
          //(unbookmark)
          state.user.bookmarks = state.user.bookmarks.filter(
            (id) => id !== postId
          );
        } else {
          //add
          state.user.bookmarks.push(postId);
        }
      }
    },
  },
});

export const {
  setAuthUser,
  setSuggestedUsers,
  setUserProfile,
  updateFollowStatus,
  setSelectedUser,
  toggleBookmark,
} = authSlice.actions;
export default authSlice.reducer;
