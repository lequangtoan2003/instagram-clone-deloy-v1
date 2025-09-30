import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    suggestedUsers: [],
    userProfile: null,
    selectedUser: null,
    isProfileLoading: false,
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
      state.isProfileLoading = false;
    },
    setSelectedUser: (state, action) => {
      state.selectedUser = action.payload;
    },
    updateFollowStatus: (state, action) => {
      const { userId, targetUserId, isFollowing } = action.payload;
      if (isFollowing) {
        // Unfollow: Xóa targetUserId khỏi following của user và userId khỏi followers của userProfile
        state.user.following = state.user.following.filter(
          (id) => id !== targetUserId
        );
        if (state.userProfile && state.userProfile._id === targetUserId) {
          state.userProfile.followers = state.userProfile.followers.filter(
            (id) => id !== userId
          );
        }
      } else {
        // Follow: Thêm targetUserId vào following của user và userId vào followers của userProfile
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
          state.user.bookmarks = state.user.bookmarks.filter(
            (id) => id !== postId
          );
        } else {
          state.user.bookmarks.push(postId);
        }
      }
    },

    setProfileLoading: (state, action) => {
      state.isProfileLoading = action.payload;
      if (action.payload === true) {
        state.userProfile = null;
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
  setProfileLoading,
} = authSlice.actions;
export default authSlice.reducer;
