import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    status: false,
    userData: null
}

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        login: (state, actions) => {
            state.status = true;
            state.userData = actions.payload.userData;
        },
        logout: (state) => {
            state.status = false;
            state.userData = null;
        }
    }
})

const authReducer = authSlice.reducer;
export default authReducer;

export const { login, logout } = authSlice.actions;