import { useRef } from "react";
import { Link, useNavigate } from "react-router-dom"
import { signupHandler } from "../services/operations/AuthAPI";
import { toast } from "react-hot-toast";

const Signup = () => {

    const firstName = useRef();
    const lastName = useRef();
    const email = useRef();
    const password = useRef();
    const confirmPassword = useRef();

    const navigate = useNavigate();

    const resetForm = () => {
        firstName.current.value = "";
        lastName.current.value = "";
        email.current.value = "";
        password.current.value = "";
        confirmPassword.current.value = "";
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password.current.value !== confirmPassword.current.value) {
            toast.error("Passwords do not match")
            return;
        }
        const data = {
            firstName: firstName.current.value,
            lastName: lastName.current.value,
            email: email.current.value,
            password: password.current.value,
            confirmPassword: confirmPassword.current.value,
        }

        const response = await signupHandler(data);

        if (response?.success === true) {
            resetForm();
            navigate("/login")
        }
    }

    return (
        <div className="bg-grey-lighter min-h-screen flex flex-col">
            <div className="container max-w-sm mx-auto flex-1 flex flex-col items-center justify-center px-2">
                <form className="bg-white px-6 py-8 rounded shadow-md text-black w-full" onSubmit={handleSubmit}>
                    <h1 className="mb-8 text-3xl text-center">Sign up</h1>
                    <input
                        type="text"
                        className="block border border-grey-light w-full p-3 rounded mb-4"
                        name="firstName"
                        ref={firstName}
                        placeholder="First Name" />

                    <input
                        type="text"
                        className="block border border-grey-light w-full p-3 rounded mb-4"
                        name="lastName"
                        ref={lastName}
                        placeholder="Last Name" />

                    <input
                        type="text"
                        className="block border border-grey-light w-full p-3 rounded mb-4"
                        name="email"
                        ref={email}
                        placeholder="Email" />

                    <input
                        type="password"
                        className="block border border-grey-light w-full p-3 rounded mb-4"
                        name="password"
                        ref={password}
                        placeholder="Password" />
                    <input
                        type="password"
                        className="block border border-grey-light w-full p-3 rounded mb-4"
                        name="confirmPassword"
                        ref={confirmPassword}
                        placeholder="Confirm Password" />

                    <button
                        type="submit"
                        className="w-full text-center py-3 rounded bg-caribbeangreen-300 text-white hover:bg-caribbeangreen-600 focus:outline-none my-1"
                    >Create Account</button>
                </form>

                <div className="text-grey-dark mt-6">
                    Already have an account?
                    <Link className="no-underline border-b border-blue text-blue" to="/login">
                        Log in
                    </Link>.
                </div>
            </div>
        </div>
    )
}

export default Signup