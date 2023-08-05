import CircularProgressBar from "../../common/CircularProgressBar"

const RenderPollStats = ({ poll }) => {
    return (
        <>
            <div className="mt-2 flex justify-evenly flex-wrap gap-y-5">
                {poll.options.map((option) => (
                    <div key={option._id} className="mb-2 flex flex-col items-center gap-y-4">
                        <CircularProgressBar percentage={`${poll.totalVotes === 0 ? 0 : Math.round((option.votes / poll.totalVotes) * 100)}`} />
                        <div className='text-center'>
                            <p className="font-bold">{option.text}</p>
                            <p className='text-sm font-medium'>{option.votes} vote(s)</p>
                        </div>
                    </div>
                ))}
            </div>
            <div className="my-8 text-center">
                <p className='text-2xl font-bold text-richblack-300'>Total Votes</p>
                <p className="text-5xl font-bold text-richblack-600">{poll.totalVotes}</p>
            </div>
        </>
    )
}

export default RenderPollStats