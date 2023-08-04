import { useRef } from "react";
import { loginHandler } from "../services/operations/AuthAPI";
import { setToken, setUser } from "../redux/slices/userSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

const Login = () => {

    const emailRef = useRef();
    const passwordRef = useRef();

    const dispatch = useDispatch();

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = {
            email: emailRef.current.value,
            password: passwordRef.current.value
        };
        let response = await loginHandler(data);
        console.log(response);

        if (!response?.success)
            return;

        dispatch(setToken(response?.token));
        dispatch(setUser(response?.user));

        navigate("/");
    }

    return (
        <div className="w-full h-[calc(100vh-3.5rem)] flex items-center justify-center">
            <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4" onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-richblack-700 text-sm font-bold mb-2" htmlFor="username">
                        Email
                    </label>
                    <input className="shadow appearance-none border rounded w-full py-2 px-3 text-richblack-700 leading-tight focus:outline-none focus:shadow-outline" id="username" type="text" placeholder="Username"
                        ref={emailRef}
                        required={true} />
                </div>
                <div className="mb-6">
                    <label className="block text-richblack-700 text-sm font-bold mb-2" htmlFor="password">
                        Password
                    </label>
                    <input className="shadow appearance-none border border-red-500 rounded w-full py-2 px-3 text-richblack-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" id="password" type="password" placeholder="******************" ref={passwordRef} required={true} />
                    <p className="text-red-500 text-xs italic">Please choose a password.</p>
                </div>
                <div className="flex items-center justify-between">
                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="Submit">
                        Sign In
                    </button>
                    {/* <a className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800" href="#">
                        Forgot Password?
                    </a> */}
                </div>
            </form>
        </div>
    )
}

export default Login