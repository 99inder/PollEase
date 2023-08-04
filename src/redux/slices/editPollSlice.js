const { createSlice } = require("@reduxjs/toolkit");

const initialState = {
    editPollFlag: false,
    editPollData: null,
};

const editPollSlice = createSlice({
    name: "editPoll",
    initialState,
    reducers: {
        setEditPollFlag: (state, value) => {
            state.editPollFlag = value.payload
        },
        setEditPollData: (state, value) => {
            state.editPollData = value.payload
        },
        resetEditPoll: (state, value) => {
            state.editPollFlag = false;
            state.editPollData = null;
        }
    }
});

export const { setEditPollFlag, setEditPollData, resetEditPoll } = editPollSlice.actions;
export default editPollSlice.reducer;