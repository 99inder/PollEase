import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { castVote, deletePoll, fetchRequiredPoll, removeVote } from '../services/operations/PollAPI';
import { useDispatch, useSelector } from 'react-redux';
import { setEditPollFlag, setEditPollData } from '../redux/slices/editPollSlice';
import RenderPollStats from '../components/core/RequiredPoll/RenderPollStats';
import RenderPollData from '../components/core/RequiredPoll/RenderPollData';
import Spinner from '../components/common/Spinner';

const RequiredPoll = ({ socket }) => {

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const location = useLocation();
    const pollId = location.pathname.split('/').at(-1);

    const { token } = useSelector(state => state.user);
    const { user } = useSelector(state => state.user);

    const [poll, setPoll] = useState(null);
    const [selectedOption, setSelectedOption] = useState('');
    const [isOwner, setIsOwner] = useState(false);
    const [isVoted, setIsVoted] = useState(false);

    socket?.on(`${poll?._id}-poll-update`, (response) => {
        setPoll(response?.data);
    })

    useEffect(() => {

        return () => {
            socket?.off(`${poll?._id}-poll-update`);
        };
        // eslint-disable-next-line
    }, [socket])

    useEffect(() => {
        // Fetch poll details from the backend using pollId
        (async () => {
            const response = await fetchRequiredPoll(pollId);
            console.log(response?.data);

            if (!response?.success)
                return;

            setPoll(response?.data);

            // selecting the option if already voted
            response?.data?.options?.forEach(option => {
                if (option?.voters?.includes(user?._id)) {
                    setSelectedOption(option?._id)
                    setIsVoted(true);
                }
            })
            setIsOwner(response?.data?.createdBy?._id === user?._id);
        })();

        // eslint-disable-next-line
    }, [pollId]);

    const handleOptionChange = (optionId) => {
        setSelectedOption(optionId);
    };

    const handleVote = async () => {
        const response = await castVote(poll._id, selectedOption, token, navigate);

        if (!response?.success)
            return;

        setIsVoted(true);
        console.log(response);
    };

    const handleDeletePoll = async () => {
        const response = await deletePoll(poll._id, token);
        if (!response?.success)
            return;

        navigate("/");
    }

    const handleRemoveVote = async () => {
        const response = await removeVote(poll._id, token);
        console.log("handleRemoveVote>>>", response);

        if (!response?.success)
            return;

        setSelectedOption('');
        setIsVoted(false);
    }

    const handleEditPoll = async () => {
        dispatch(setEditPollFlag(true));
        dispatch(setEditPollData(poll));
        navigate("/editPoll");
    }

    if (!poll) {
        return <Spinner />;
    }

    return (
        <div className='w-11/12 max-w-maxContent mx-auto text-richblack-700 my-10'>
            <div className="px-4 py-7 bg-[#f9f9f9] shadow rounded-lg ">
                <h1 className="text-3xl font-bold mb-3">{poll.question}</h1>
                <p className='text-richblack-400 mb-3'>Asked by <span className='text-richblack-800 font-semibold italic'>{`${poll?.createdBy?.firstName + ' ' + poll?.createdBy?.lastName}`}</span></p>

                <RenderPollData poll={poll} handleOptionChange={handleOptionChange} handleVote={handleVote} handleRemoveVote={handleRemoveVote} selectedOption={selectedOption} isVoted={isVoted} isOwner={isOwner} handleDeletePoll={handleDeletePoll} handleEditPoll={handleEditPoll} />

                <div className='pt-8 mt-8 border-t-[2px] border-richblack-200'>
                    <RenderPollStats poll={poll} />
                </div>
            </div>

        </div>
    )
}

export default RequiredPoll