import RenderPolls from "../components/core/Homepage/RenderPolls";
import { PiDotFill } from "react-icons/pi";

const Homepage = ({ socket }) => {
  return (
    <div className="mt-16">
      <h1 className="text-center mb-8 text-3xl font-semibold flex gapx-x-3 items-center justify-center">
        <PiDotFill className="text-caribbeangreen-200 text-5xl"/>
        <p>Live Polls</p>
      </h1>
      <RenderPolls socket={socket} />
    </div>
  )
}

export default Homepage