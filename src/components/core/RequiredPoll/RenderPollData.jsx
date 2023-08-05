import React from 'react'
import HorizontalProgressBar from '../../common/HorizontalProgressBar'
import { MdDeleteOutline } from "react-icons/md";
import { FiEdit } from "react-icons/fi";

const RenderPollData = ({ poll, handleOptionChange, handleVote, handleRemoveVote, selectedOption, isVoted, isOwner, handleDeletePoll, handleEditPoll }) => {

    return (
        <div className='flex flex-wrap flex-col md:flex-row justify-between gap-y-11'>

            <div className='basis-8/12'>
                {poll.options.map((option) => (
                    <div key={option._id} className="mb-5" onClick={() => handleOptionChange(option._id)}>
                        <div className={` bg-white px-3 py-4 ${option._id === selectedOption ? "border-caribbeangreen-200 border-[2px] shadow-caribbeangreen-100 translate-x-2" : "shadow-richblack-200"}  rounded-md shadow-lg transition-all duration-200`}>
                            <div className='flex justify-between text-2xl font-bold'>
                                <p>{option.text}</p>
                                <p>{`${poll.totalVotes === 0 ? 0 : Math.round((option.votes / poll.totalVotes) * 100)}`} %</p>
                            </div>
                            <div className='my-3 h-2'>
                                <HorizontalProgressBar showPercentage={false} percentage={`${poll.totalVotes === 0 ? 0 : Math.round((option.votes / poll.totalVotes) * 100)}`} />
                            </div>
                            <div className='text-richblack-300 font-semibold'>
                                <p>{option?.votes} Vote(s)</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className='basis-3/12 flex justify-center'>
                <div className='flex flex-col items-center w-full max-w-xs md:max-w-full'>
                    {
                        !isVoted
                            ?
                            <button
                                onClick={handleVote}
                                className={`bg-blue-500 w-full text-white py-2 px-4 rounded hover:bg-blue-600 transition-all duration-200`}
                            >
                                Submit Your Vote
                            </button>
                            :
                            <button
                                onClick={handleRemoveVote}
                                className="text-richblack-5 bg-pink-600 px-3 py-2 rounded-md w-full"
                            >
                                Remove Your Vote
                            </button>
                    }

                    {/* RIGHT CARD */}
                    <div className='bg-white h-[200px] w-full shadow-xl rounded-lg mt-4 px-4 py-5'>
                        <div>
                            <p className='text-richblack-200 text-l font-semibold'>Total Votes</p>
                            <p className='text-4xl font-extrabold text-richblack-700'>{poll?.totalVotes}</p>
                        </div>
                        <div className='mt-4'>
                            {
                                isOwner
                                &&
                                (<div className='flex flex-wrap gap-3 font-medium'>
                                    <button
                                        type="button"
                                        className='bg-richblack-50 text-pink-600 hover:text-richblack-5 hover:bg-pink-600 w-12 rounded-full aspect-square transition-all duration-200 flex items-center justify-center'
                                        onClick={handleDeletePoll}
                                    >
                                        <MdDeleteOutline className='text-2xl' />
                                    </button>
                                    <button
                                        type="button"
                                        className='text-blue-500 bg-richblack-50 hover:text-richblack-5 hover:bg-blue-500 w-12 rounded-full aspect-square transition-all duration-200 flex items-center justify-center'
                                        onClick={handleEditPoll}
                                    >
                                        <FiEdit className='text-xl' />
                                    </button>
                                </div>)
                            }
                        </div>

                    </div>
                </div>
            </div>
        </div>
    )
}

export default RenderPollData