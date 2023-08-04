import React, { useEffect, useState } from 'react';
import { createPoll, editPoll } from '../../../services/operations/PollAPI';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { resetEditPoll } from '../../../redux/slices/editPollSlice';
import { AiOutlinePlusCircle } from 'react-icons/ai';
import { IoIosCloseCircleOutline } from 'react-icons/io';

const CreatePollForm = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { token } = useSelector(state => state.user);
    const { editPollFlag, editPollData } = useSelector(state => state.editPoll);

    const [question, setQuestion] = useState('');
    const [options, setOptions] = useState(['', '']); // Initialize with two empty options

    const handleQuestionChange = (e) => {
        setQuestion(e.target.value);
    };

    const handleOptionChange = (index, e) => {
        const updatedOptions = [...options];
        updatedOptions[index] = e.target.value;
        setOptions(updatedOptions);
    };

    // addOption Handler function
    const addOption = () => {
        setOptions([...options, '']);
    };

    // Function to remove additional options
    const removeOption = (index) => {
        const updatedOptions = options.filter((_, i) => i !== index);
        setOptions(updatedOptions);
    };

    // Form Submit Handler Function
    const handleSubmit = async (e) => {
        e.preventDefault();

        let response = null;
        const data = {
            question,
            options: JSON.stringify(options),
        }

        if (editPollFlag) {
            const response = await editPoll(data, editPollData._id, token, navigate);
            console.log(response);
        }
        else {
            response = await createPoll(data, token);
            console.log(response);
        }


        if (!response?.success)
            return;

        //reset form
        setQuestion('');
        setOptions(['', '']);
        navigate("/");
    };

    useEffect(() => {
        if (editPollFlag) {
            const options = editPollData?.options.map(option => option.text);
            setQuestion(editPollData.question);
            setOptions(options);
        }

        return () => {
            dispatch(resetEditPoll());
            setQuestion('');
            setOptions(['', '']);
        }
        // eslint-disable-next-line
    }, [])

    return (
        <div className="bg-richblack-5 w-[350px] px-5 rounded-md py-4 mx-auto">
            <form onSubmit={handleSubmit}>

                {/* QUESTION */}
                <textarea
                    type="text"
                    name="question"
                    id='question'
                    placeholder="Ask a question..."
                    value={question}
                    onChange={handleQuestionChange}
                    required
                    className={`w-full bg-[inherit] text-xl rounded-md h-auto ${question.length !== 0 && "text-richblack-500 font-semibold"}`}
                />
                {/* OPTIONS */}
                <div className="flex flex-col gap-y-2 mt-2">
                    {
                        options.map((option, index) => (
                            <div className='relative'>
                                <input
                                    type="text"
                                    placeholder={`Option ${index + 1}`}
                                    id={`option${index + 1}`}
                                    value={option}
                                    onChange={(e) => handleOptionChange(index, e)}
                                    required
                                    className={`w-full border-[1px] border-richblack-25 rounded-md py-1 px-2 pr-[30px] h-10 ${options[index].length !== 0 && "text-richblack-500"}`}
                                />
                                {index >= 2 && (
                                    <button
                                        type="button"
                                        onClick={() => removeOption(index)}
                                        className='text-xl text-richblack-200 absolute right-[6px] top-[25%] hover:font-medium hover:text-pink-400 transition-all duration-200'
                                    >
                                        <IoIosCloseCircleOutline />
                                    </button>
                                )}
                            </div>
                        ))
                    }
                </div>

                {/* ADD OPTION BUTTON */}
                <button
                    type='button'
                    onClick={addOption}
                    className='flex gap-x-3 text-richblack-100 items-center mt-3 hover:scale-105 hover:font-medium hover:text-blue-300 transition-all duration-200'
                >
                    <AiOutlinePlusCircle />
                    <p>Add option</p>

                </button>

                {/* START POLL BUTTON */}
                <div className='mt-3 pt-6 border-t-[1px] border-richblack-50'>
                    <button type="submit"
                        className='w-full bg-richblack-100 text-richblack-400 hover:text-richblack-5 hover:bg-blue-500 rounded-md border-[1px] border-richblack-100 hover:border-richblack-700 py-2 transition-all duration-200'
                    >
                        {
                            !editPollFlag ?
                                "Start Poll" :
                                "Edit Poll"
                        }
                    </button>
                </div>
            </form>

        </div>
    );
};

export default CreatePollForm;
