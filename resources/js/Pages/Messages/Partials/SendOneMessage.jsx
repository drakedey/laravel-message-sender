import { useForm } from '@inertiajs/react';
import { useState } from 'react';
import MessageContent from '../Components/MessageContent';
import ProvidersSelectors from '../Components/ProvidersSelectors';
import UserSearcher from '../Components/UserSearcher';

export default function SendOneMessage({ handleSubmitFinished, maxFileSize }) {
    const [providers, setProviders] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);

    const { data, setData, post, processing } = useForm({
        content: '',
        message_provider_id: '',
        recipient_id: '',
        file: null,
    });

    const resetView = () => {
        setProviders([]);
        setSelectedUser(null);
        setData('content', '');
        setData('message_provider_id', '');
        setData('recipient_id', '');
        setData('file', null);
        handleSubmitFinished();
    };

    const fetchUserProviders = async (userId) => {
        try {
            const response = await axios.get(
                route('providers.user-providers'),
                {
                    params: { user_id: userId },
                },
            );
            setProviders(response.data);
        } catch (error) {
            console.error('Error fetching providers:', error);
        }
    };

    const handleUserSelect = (user) => {
        setSelectedUser(user);
        setData('recipient_id', user.id);
        fetchUserProviders(user.id);
    };

    const searchUsers = async (search) => {
        if (search.length < 2) return;

        try {
            const response = await axios.get(route('users.search-users'), {
                params: { search },
            });
            return response.data;
        } catch (error) {
            console.error('Error searching users:', error);
        }
    };

    const handleSubimtSuccess = () => {
        alert('Message sent successfully');
        resetView();
    };

    const handleSubmitError = () => {
        alert('Error enviando mensaje');
        resetView();
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];

        setData('file', file);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('messages.store'), {
            async: true,
            onSuccess: handleSubimtSuccess,
            onError: handleSubmitError,
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
                <UserSearcher
                    userApiSearcher={searchUsers}
                    handleUserSelect={handleUserSelect}
                />
            </div>

            {selectedUser && (
                <ProvidersSelectors
                    providers={providers}
                    handleProviderSelect={(e) =>
                        setData('message_provider_id', e.target.value)
                    }
                    providerId={data.message_provider_id}
                />
            )}

            {data.message_provider_id && (
                <MessageContent
                    handleContentChange={(e) =>
                        setData('content', e.target.value)
                    }
                    message={data.content}
                    handleFileChange={handleFileChange}
                    file={data.file}
                    maxFileSize={maxFileSize}
                />
            )}

            {data.message_provider_id && data.content && (
                <button
                    type="submit"
                    className="rounded-lg bg-blue-500 px-4 py-2 text-white"
                    disabled={processing}
                >
                    Send Message
                </button>
            )}
        </form>
    );
}
