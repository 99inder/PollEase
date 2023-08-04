import { combineReducers } from "@reduxjs/toolkit";
import userReducer from "../slices/userSlice"
import editPollReducer from "../slices/editPollSlice"

const rootReducer = combineReducers({
    user: userReducer,
    editPoll: editPollReducer,
})

export default rootReducer;