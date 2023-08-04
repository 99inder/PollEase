import { toast } from "react-hot-toast"
import { apiConnector } from "../apiconnector";
import { pollAPI } from "../apis";

const {
    CREATE_POLL_API,
    FETCH_ALL_POLLS_API,
    FETCH_REQUIRED_POLL_API,
    DELETE_POLL_API,
    CAST_VOTE_API,
    REMOVE_VOTE_API,
} = pollAPI;

//createPoll Handler function
export const createPoll = async (data, token) => {

    let result = null;
    const toastId = toast.loading("Creating Poll...");

    try {
        const response = await apiConnector("POST", CREATE_POLL_API, data, {
            Authorization: `Bearer ${token}`
        });

        if (!response?.data?.success) {
            throw new Error("Could Not Create Poll");
        }

        toast.success("Poll Created Successfully");
        result = response?.data;
    } catch (error) {
        console.log(error);
        toast.error(error?.response?.data?.message);
    }

    toast.dismiss(toastId);
    return result;
}

//fetchAllPolls Handler function
export const fetchAllPolls = async () => {
    let result = null;
    const toastId = toast.loading("Fetching all polls...");

    try {
        const response = await apiConnector("GET", FETCH_ALL_POLLS_API);
        result = response?.data;
        toast.success("All Polls Fetch Successfully");
    } catch (error) {
        console.log(error);
        toast.error(error?.response?.data?.message);
    }

    toast.dismiss(toastId);
    return result;
}

//fetchRequiredPoll Handler function
export const fetchRequiredPoll = async (pollId) => {
    let result = null;
    const toastId = toast.loading("Fetching poll details...");

    try {
        const response = await apiConnector("POST", FETCH_REQUIRED_POLL_API, { pollId });
        result = response?.data;
        toast.success("Poll Data Fetched Successfully");
    } catch (error) {
        console.log(error);
        toast.error(error?.response?.data?.message);
    }

    toast.dismiss(toastId);
    return result;
}

//castVote Handler function
export const castVote = async (pollId, optionId, token, navigate) => {

    if (!token) {
        toast.error("Please login first");
        navigate("/login");
        return;
    }

    let result = null;
    const toastId = toast.loading("Voting in progress...");

    try {
        const response = await apiConnector("POST", CAST_VOTE_API, {
            pollId,
            optionId
        }, {
            Authorization: `Bearer ${token}`
        });

        result = response?.data;
        toast.success("Voted Successfully");

    } catch (error) {
        console.log(error);
        toast.error(error?.response?.data?.message);
    }
    toast.dismiss(toastId);
    return result;
}

// deletePoll Handler function
export const deletePoll = async (pollId, token) => {
    let result = null;
    const toastId = toast.loading("Deleting Poll...");

    try {
        const response = await apiConnector("DELETE", DELETE_POLL_API, { pollId }, {
            Authorization: `Bearer ${token}`
        })
        toast.success("Poll Deleted Successfully");
        result = response?.data;

    } catch (error) {
        console.log(error);
        toast.error(error?.response?.data?.message);
    }

    toast.dismiss(toastId);
    return result;
}

// removeVote Handler function
export const removeVote = async (pollId, token) => {
    let result = null;
    const toastId = toast.loading("Removing Vote...");

    try {
        const response = await apiConnector("DELETE", REMOVE_VOTE_API, { pollId }, {
            Authorization: `Bearer ${token}`
        });
        result = response?.data;
        toast.success("Vote Removed");
    } catch (error) {
        console.log(error);
        toast.error(error?.response?.data?.message);
    }
    toast.dismiss(toastId);
    return result;
}

// editPoll Handler function
export const editPoll = async (data, pollId, token, navigate) => {
    let result = null;
    const toastId = toast.loading("Editing Poll...");

    try {
        toast.error("Edit Poll Not Implemented Yet")
        navigate('/');
    } catch (error) {
        console.log(error);
        toast.error(error?.response?.data?.message);
    }

    toast.dismiss(toastId);
    return result;
}