const { default: mongoose } = require("mongoose");
const Poll = require("../models/Poll")
const User = require("../models/User")

// Fetch All Polls to display on homepage
exports.fetchAllPolls = async (req, res) => {
    try {
        const allPolls = await Poll.find();
        return res.status(200).json({
            success: true,
            message: "All polls fetched successfully",
            data: allPolls
        })
    } catch (error) {
        console.log("Error occured at 'fetchAllPolls' handler");
        console.log(error);

        return res.status(500).json({
            success: false,
            message: "Error at 'fetchAllPolls' handler",
            error: error.message
        })
    }
}

// Fetch specific poll (Populated with all data)
exports.fetchRequiredPoll = async (req, res) => {
    // extract pollId from request body
    const { pollId } = req.body;
    // perform validations
    if (!pollId) {
        return res.status(400).json({
            success: false,
            message: "pollId not provided"
        })
    }
    try {
        const requiredPoll = await Poll.findById(pollId)
            .populate('createdBy', 'firstName lastName email');

        if (!requiredPoll) {
            return res.status(404).json({
                success: false,
                message: "No poll found corresponding to the provided pollId"
            })
        }

        return res.status(200).json({
            success: true,
            message: "Required poll fetched successfully",
            data: requiredPoll
        })
    } catch (error) {
        console.log("Error occured at 'fetchRequiredPoll' handler");
        console.log(error);

        return res.status(500).json({
            success: false,
            message: "Error at 'fetchRequiredPoll' handler",
            error: error.message
        })
    }
}

// createPoll Handler
exports.createPoll = async (req, res) => {
    try {
        // Extract data from the request body
        const question = req?.body?.question;

        let options = req?.body?.options;
        options = JSON.parse(options);

        const userId = req?.user?.id;

        // Check if the createdBy user exists in the User collection
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "UserId not received"
            });
        }

        if (!question || (!options && options.length === 0)) {
            return res.status(404).json({
                success: false,
                message: "Required Data Not Received"
            });
        }

        // Create a new Poll document with the provided data
        const poll = new Poll({
            createdBy: user._id,
            question,
            options: options.map((option) => ({ text: option })),
        });

        // Save the poll to the database
        await poll.save();

        // push poll._id to user.pollsCreated
        user.pollsCreated.push(poll._id);
        // save updated user
        await user.save();

        // Socket IO Live Update Task
        req.io.emit("homepage-update", {
            success: true,
            type: 'createPoll',
            message: "Io homepage-update received from '/createPoll",
            data: poll
        })

        return res.status(201).json({
            success: true,
            message: 'Poll created successfully.',
            data: poll
        });

    } catch (error) {
        console.log("Error occured at 'createPoll' handler");
        console.log(error);

        return res.status(500).json({
            success: false,
            message: "Error at 'createPoll' handler",
            error: error.message
        })
    }
};

//castVote Handler
exports.castVote = async (req, res) => {
    try {
        const { pollId, optionId } = req.body;
        const userId = req.user.id;

        if (!pollId || !optionId) {
            return res.status(404).json({
                success: false,
                message: "Required fields not received",
            })
        }

        // Find the poll by ID and check if it exists
        const poll = await Poll.findById(pollId).populate('createdBy').exec();
        if (!poll) {
            return res.status(404).json({
                success: false,
                message: 'Poll not found.'
            });
        }

        // Find the user who is casting the vote
        const user = await User.findById(userId);

        // Check if the user exists
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User is invalid. Try Logging In again."
            })
        }

        // Check if the user has already voted for this poll
        if (user.votedOn.includes(poll._id)) {
            return res.status(400).json({
                success: false,
                message: 'You have already voted on this poll.'
            });
        }

        // Find the selected option in the poll's options array
        const selectedOption = poll.options.find((option) => option._id.toString() === optionId);
        if (!selectedOption) {
            return res.status(404).json({
                success: false,
                message: 'Option not found.'
            });
        }

        // Increment the vote count for the selected option and add the user to the voters array
        selectedOption.votes += 1;
        selectedOption.voters.push(user._id);

        // Increment the totalVotes count for the poll
        poll.totalVotes += 1;

        // Save the updated poll
        await poll.save();

        // push poll._id to user.votedOn
        user.votedOn.push(poll._id);
        //save the updated User
        await user.save();

        // Socket IO Live Update Task
        req.io.emit("homepage-update", {
            success: true,
            type: 'update',
            message: "Io homepage-update received",
            data: poll
        })

        req.io.emit(`${pollId}-poll-update`, {
            success: true,
            message: `Io ${pollId}-poll-update received from '/castVote`,
            data: poll
        })

        return res.status(201).json({
            success: true,
            message: 'Voted Successfully.',
            data: poll
        });

    } catch (error) {
        console.log("Error occured at 'castVote' handler");
        console.log(error);

        return res.status(500).json({
            success: false,
            message: "Error at 'castVote' handler",
            error: error.message
        })
    }
}

//deletePoll Handler
exports.deletePoll = async (req, res) => {
    try {
        const { pollId } = req.body;
        const userId = req.user.id;

        // parameters validation
        if (!pollId) {
            return res.status(404).json({
                success: false,
                message: "All required fields must be provided"
            })
        }

        const poll = await Poll.findById(pollId);
        //poll validation
        if (!poll) {
            return res.status(404).json({
                success: false,
                message: "Poll not found"
            })
        }

        // Authorization Validation
        if (userId.toString() !== poll.createdBy._id.toString()) {
            return res.status(401).json({
                success: false,
                message: "Access Denied - Unauthorized"
            })
        }

        // Remove the pollId from the Owner's User.pollsCreated
        await User.findByIdAndUpdate(userId, {
            $pull: { pollsCreated: pollId }
        });

        // Remove the pollId from the votedOn array of every user who voted for the poll
        const votersIdArray = [];
        poll.options.forEach((option) => {
            option.voters.forEach(voter => {
                votersIdArray.push(voter);
            })
        });

        votersIdArray.map(async (voterId) => {
            await User.findByIdAndUpdate(voterId,
                { $pull: { votedOn: poll._id } }
            )
        })

        // delete poll
        await poll.deleteOne();

        // Socket IO Live Update Task
        req.io.emit("homepage-update", {
            success: true,
            type: 'deletePoll',
            message: "Io homepage-update received from '/deletePoll",
            data: poll
        })

        // return response
        return res.status(200).json({
            success: true,
            message: "Poll Deleted Successfully"
        })

    } catch (error) {
        console.log("Error occured at 'deletePoll' handler");
        console.log(error.message);

        return res.status(500).json({
            success: false,
            message: "Error at 'deletePoll' handler",
            error: error.message
        })
    }
}

//removeVote Handler
exports.removeVote = async (req, res) => {
    try {
        const { pollId } = req.body;
        const userId = req.user.id;

        if (!pollId || !userId) {
            return res.status(404).json({
                success: false,
                message: "All required fields not received."
            })
        }

        const poll = await Poll.findOneAndUpdate(
            { _id: pollId, 'options.voters': userId },
            { $pull: { 'options.$.voters': userId }, $inc: { totalVotes: -1, 'options.$.votes': -1 } },
            { new: true }
        ).populate('createdBy').exec();

        if (!poll) {
            return res.status(404).json({
                success: false,
                message: "Poll not found",
            })
        }

        const user = await User.findByIdAndUpdate(userId,
            { $pull: { votedOn: pollId } }
        );

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Vote not found on this poll.",
            })
        }

        // Socket IO Live Update Task
        req.io.emit("homepage-update", {
            success: true,
            type: 'update',
            message: "Io homepage-update received",
            data: poll
        })

        req.io.emit(`${pollId}-poll-update`, {
            success: true,
            message: `Io ${pollId}-poll-update received from '/removeVote`,
            data: poll
        })

        return res.status(200).json({
            success: true,
            message: "Vote Removed"
        });


    } catch (error) {
        console.log("Error occured at 'removeVote' handler");
        console.log(error.message);

        return res.status(500).json({
            success: false,
            message: "Error at 'removeVote' handler",
            error: error.message
        })
    }
}