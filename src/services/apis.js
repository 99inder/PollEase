const BASE_URL_API_V1 = process.env.REACT_APP_SERVER_BASE_URL + "/api/v1";

const AUTH_BASE_URL = BASE_URL_API_V1 + "/user";
const POLL_BASE_URL = BASE_URL_API_V1 + "/polls";


export const authAPI = {
    SIGNUP_API: AUTH_BASE_URL + "/signup",
    LOGIN_API: AUTH_BASE_URL + "/login",
}

export const pollAPI = {
    CREATE_POLL_API: POLL_BASE_URL + "/createPoll",
    FETCH_ALL_POLLS_API: POLL_BASE_URL + "/fetchAllPolls",
    FETCH_REQUIRED_POLL_API: POLL_BASE_URL + "/fetchRequiredPoll",
    DELETE_POLL_API: POLL_BASE_URL + "/deletePoll",
    CAST_VOTE_API: POLL_BASE_URL + "/castVote",
    REMOVE_VOTE_API: POLL_BASE_URL + "/removeVote",
}