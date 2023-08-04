import { useEffect, useState } from "react";
import { fetchAllPolls } from "../../../services/operations/PollAPI";
import { BsChevronRight } from "react-icons/bs"
import { Link } from "react-router-dom";
import Spinner from "../../common/Spinner";
import { toast } from "react-hot-toast";

const RenderPolls = ({ socket }) => {

    const [pollsData, setPollsData] = useState([]);

    const handleLivePollUpdate = (response) => {
        const updatedPollsData = pollsData.map(poll => {
            if (poll._id === response?.data?._id)
                return response?.data
            else
                return poll;
        });

        setPollsData(updatedPollsData);
    }

    const handleLivePollCreated = (response) => {
        const updatedPollsData = [...pollsData, response?.data];
        setPollsData(updatedPollsData);
    }

    const handleLivePollDelete = (response) => {
        const updatedPollsData = pollsData.filter(poll => poll._id !== response?.data?._id);
        setPollsData(updatedPollsData);
    }

    useEffect(() => {
        (async () => {
            let response = null;

            response = await fetchAllPolls();
            if (response?.success) {
                setPollsData(response?.data);
            }
            // retry connecting to server
            else {
                const intervalId = setInterval(async () => {
                    response = await fetchAllPolls();
                    if (response?.success) {
                        setPollsData(response?.data);
                        clearInterval(intervalId)
                    }
                    else {
                        const toastId = toast.loading("Retrying in 5 secs...");
                        setTimeout(() => {
                            toast.dismiss(toastId);
                        }, [3000])
                    }
                }, 5000);
            }

            if (!response?.success)
                return;

        })();
        // eslint-disable-next-line
    }, [])

    socket?.on("homepage-update", (response) => {

        console.log("Socket Trigerred");

        if (response?.type === 'update') {
            handleLivePollUpdate(response);
        }

        else if (response?.type === 'createPoll') {
            handleLivePollCreated(response);
        }

        else if (response?.type === 'deletePoll') {
            handleLivePollDelete(response);
        }
    })

    useEffect(() => {
        return () => {
            socket?.off("homepage-update");
        };
    }, [socket])

    return (
        <div className="w-11/12 max-w-maxContent mx-auto">
            {
                pollsData.length > 0
                    ?
                    (
                        pollsData.map(poll => (
                            <Link to={`/polls/${poll._id}`} key={poll._id} className="flex justify-between items-center bg-richblack-5 my-5 rounded-md py-4 px-9 group">
                                <div className="">
                                    <h5 className="text-richblack-700 text-2xl font-semibold">{poll?.question}</h5>
                                    <p className="text-richblack-500 mt-4">Total Votes: {poll?.totalVotes}</p>
                                </div>
                                <BsChevronRight className="text-richblack-200 text-3xl group-hover:translate-x-3 group-hover:text-richblack-700 transition-all duration-200" />
                            </Link>
                        ))
                    )
                    :
                    <Spinner />
            }
        </div>
    )
}

export default RenderPolls