import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    loading: false,
    user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null,
    token: localStorage.getItem('token') ? JSON.parse(localStorage.getItem('token')) : null,
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setLoading: (state, value) => {
            state.loading = value.payload
        },
        setToken: (state, value) => {
            state.token = value.payload
        },
        setUser: (state, value) => {
            state.user = value.payload
        }
    }
})

export const { setLoading, setToken, setUser } = userSlice.actions;
export default userSlice.reducer;