import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import axios from 'axios';
import { useState } from 'react';
import MessageContent from './Components/MessageContent';
import ProvidersSelectors from './Components/ProvidersSelectors';
import UserSearcher from './Components/UserSearcher';
import SendMultipleMessage from './Partials/SendMultipleMessage';

export default function Create({ auth }) {
    const [messageType, setMessageType] = useState(null);
    const [providers, setProviders] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);

    const { data, setData, post, processing } = useForm({
        content: '',
        message_provider_id: '',
        recipient_id: '',
    });

    const searchUsers = async (search) => {
        if (search.length < 2) return;

        try {
            const response = await axios.get(route('messages.search-users'), {
                params: { search },
            });
            return response.data;
        } catch (error) {
            console.error('Error searching users:', error);
        }
    };

    const fetchUserProviders = async (userId) => {
        try {
            const response = await axios.get(route('messages.user-providers'), {
                params: { user_id: userId },
            });
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

    const resetView = () => {
        setMessageType(null);
        setProviders([]);
        setSelectedUser(null);
        setData('content', '');
        setData('message_provider_id', '');
        setData('recipient_id', '');
    };

    const handleSubimtSuccess = () => {
        alert('Message sent successfully');
        resetView();
    };

    const handleSubmitError = () => {
        alert('Error enviando mensaje');
        resetView();
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
        <AuthenticatedLayout user={auth.user}>
            <Head title="Send Message" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <h2 className="mb-6 text-lg font-medium">
                                Send Message
                            </h2>

                            {/* Message Type Selection */}
                            {
                                <div className="space-x-4">
                                    <button
                                        onClick={() => setMessageType('single')}
                                        className="rounded-lg bg-blue-500 px-4 py-2 text-white"
                                    >
                                        Send to Single User
                                    </button>
                                    <button
                                        onClick={() =>
                                            setMessageType('multiple')
                                        }
                                        className="rounded-lg bg-blue-500 px-4 py-2 text-white"
                                    >
                                        Send to Multiple Users
                                    </button>
                                </div>
                            }

                            {messageType === 'single' && (
                                <form
                                    onSubmit={handleSubmit}
                                    className="space-y-6"
                                >
                                    {/* User Search */}
                                    <div className="relative">
                                        <UserSearcher
                                            userApiSearcher={searchUsers}
                                            handleUserSelect={handleUserSelect}
                                        />
                                    </div>

                                    {/* Provider Selection - Only show if user is selected */}
                                    {selectedUser && (
                                        <ProvidersSelectors
                                            providers={providers}
                                            handleProviderSelect={(e) =>
                                                setData(
                                                    'message_provider_id',
                                                    e.target.value,
                                                )
                                            }
                                            providerId={
                                                data.message_provider_id
                                            }
                                        />
                                    )}

                                    {/* Message Content - Only show if provider is selected */}
                                    {data.message_provider_id && (
                                        <MessageContent
                                            handleContentChange={(e) =>
                                                setData(
                                                    'content',
                                                    e.target.value,
                                                )
                                            }
                                            message={data.content}
                                        />
                                    )}
                                    {/* Submit Button - Only show if all fields are filled */}
                                    {data.message_provider_id &&
                                        data.content && (
                                            <button
                                                type="submit"
                                                className="rounded-lg bg-blue-500 px-4 py-2 text-white"
                                                disabled={processing}
                                            >
                                                Send Message
                                            </button>
                                        )}
                                </form>
                            )}

                            {messageType === 'multiple' && (
                                <SendMultipleMessage
                                    handleSubmitFinished={resetView}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
