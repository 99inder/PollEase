import { toast } from "react-hot-toast";
import { apiConnector } from "../apiconnector";
import { authAPI } from "../apis"
import { setToken, setUser } from "../../redux/slices/userSlice";

const { SIGNUP_API,
    LOGIN_API,
} = authAPI;

export const signupHandler = async (data) => {
    const toastId = toast.loading("Signing Up...");
    let result;

    try {
        const response = await apiConnector("POST", SIGNUP_API, data);
        toast.success("Signup Successful")
        result = response?.data;
    } catch (error) {
        console.log(error);
        toast.error(error?.response?.data?.message);
    }

    toast.dismiss(toastId);
    return result;
}

export const loginHandler = async (data) => {
    const toastId = toast.loading("Logging In...");
    let result;

    try {
        const response = await apiConnector("POST", LOGIN_API, data);
        result = response?.data;
        toast.success("Login Successful");

        //setting localStorage
        localStorage.setItem("token", JSON.stringify(response?.data?.token));
        localStorage.setItem("user", JSON.stringify(response?.data?.user));
    } catch (error) {
        console.log(error);
        toast.error(error?.response?.data?.message)
    }
    toast.dismiss(toastId);
    return result;
}

export const logoutHandler = (navigate) => {
    return async (dispatch) => {
        const toastId = toast.loading("Logging Out...");

        localStorage.removeItem("token");
        localStorage.removeItem("user");
        dispatch(setToken(null));
        dispatch(setUser(null));

        toast.dismiss(toastId);
        toast.success("Logout Successful");
        navigate("/");
    }
}
