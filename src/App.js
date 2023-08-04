import { useEffect, useState } from "react"
import { Route, Routes } from "react-router-dom";
import { io } from "socket.io-client"
import Navbar from "./components/common/Navbar";
import Homepage from "./pages/Homepage";
import CreatePollPage from "./pages/CreatePoll";
import Signup from "./pages/Signup";
import { Toaster } from "react-hot-toast";
import Login from "./pages/Login";
import RequiredPoll from "./pages/RequiredPoll";

const App = () => {

  const [socket, setSocket] = useState(null)

  useEffect(() => {
    const newSocket = io(process.env.REACT_APP_SERVER_BASE_URL)
    setSocket(newSocket);

    socket?.on("connect", () => {
      console.log("Connecting Socket")
      console.log(socket.id);
    });

    return () => {
      console.log("Disconnecting Socket");
      socket?.disconnect();
    };
    // eslint-disable-next-line
  }, []);

  return (
    <div className="w-screen h-screen overflow-x-hidden bg-richblack-800 text-richblack-25 font-inter">
      <Navbar />

      <Routes>
        <Route path="/" element={<Homepage socket={socket} />} />

        <Route path="/signup" element={<Signup />} />

        <Route path="/login" element={<Login />} />

        <Route path="/createPoll" element={<CreatePollPage />} />

        <Route path="/editPoll" element={<CreatePollPage />} />

        <Route path="/polls/:pollId" element={<RequiredPoll socket={socket} />} />

        <Route path="*" element={<h1>No Found</h1>} />

      </Routes>

      <Toaster />
    </div>
  )
}

export default App