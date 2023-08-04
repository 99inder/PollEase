import { useLocation } from 'react-router-dom';
import CreatePollForm from '../components/core/CreatePoll/CreatePollForm';

const CreatePollPage = () => {
    const location = useLocation();
    
    return (
        <div>
            <div className='w-11/12 max-w-maxContent mx-auto mt-9'>
                <h1 className='mb-6 text-center text-2xl font-semibold text-richblack-50'>{location.pathname.split('/').at(-1) === 'editPoll' ? 'Edit Poll' : 'Create Poll'}</h1>
                <CreatePollForm />
            </div>
        </div>
    );
};

export default CreatePollPage;
