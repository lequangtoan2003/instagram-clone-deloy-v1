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
  },
});

export const {
  setAuthUser,
  setSuggestedUsers,
  setUserProfile,
  updateFollowStatus,
  setSelectedUser,
} = authSlice.actions;
export default authSlice.reducer;
