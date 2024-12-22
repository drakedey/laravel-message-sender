import { useForm } from '@inertiajs/react';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import MessageContent from '../Components/MessageContent';
import ProvidersSelectors from '../Components/ProvidersSelectors';
import UserSearcher from '../Components/UserSearcher';

export default function SendMultipleMessage({ handleSubmitFinished }) {
    const [providers, setProviders] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState({});

    const { data, setData, post, processing } = useForm({
        content: '',
        message_provider_id: '',
        recipent_ids: [],
    });

    const searchUsersWithProviders = async (search) => {
        if (search.length < 2) return;

        try {
            const response = await axios.get(
                route('messages.search-users-with-providers'),
                {
                    params: { search, providerId: data.message_provider_id },
                },
            );
            return response.data;
        } catch (error) {
            console.error('Error searching users:', error);
        }
    };

    const handleUserSelect = (user) => {
        setSelectedUsers((prev) => ({ ...prev, [user.id]: user }));
    };

    const handleRemoveClick = (e, userId) => {
        e.preventDefault();
        setSelectedUsers((prev) => {
            delete prev[userId];
            return { ...prev };
        });
    };

    const renderSelectedUsers = () => {
        if (Object.values(selectedUsers).length === 0)
            return (
                <div className="text-sm text-gray-600">No users selected</div>
            );
        return (
            <div className="w-full rounded-lg border px-3 py-2">
                {Object.values(selectedUsers).map((user) => (
                    <div key={user.id} className="mb-2">
                        {user.name} - {user.email} -{' '}
                        <button
                            className="rounded-lg bg-red-500 px-4 py-2 text-white"
                            onClick={(e) => handleRemoveClick(e, user.id)}
                        >
                            Remove
                        </button>
                    </div>
                ))}
            </div>
        );
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(data);
        post(route('messages.massStore'), {
            async: true,
            onSuccess: () => {
                alert('Message sent successfully');
                setSelectedUsers([]);
                setData('content', '');
                setData('message_provider_id', '');
                handleSubmitFinished();
            },
            onError: (err) => {
                alert('Error sending message');
            },
        });
    };

    useEffect(() => {
        // Fetch providers
        axios
            .get(route('messages.all-providers'))
            .then((response) => {
                setProviders(response.data);
            })
            .catch((error) => {
                console.error('Error fetching providers:', error);
            });
    }, []);

    useEffect(() => {
        setData('recipent_ids', Object.keys(selectedUsers));
    }, [selectedUsers]);

    return (
        <div>
            <h3 className="mb-4 text-lg font-medium">Send to Multiple Users</h3>
            <form onSubmit={handleSubmit} className="space-y-6">
                <ProvidersSelectors
                    providers={providers}
                    handleProviderSelect={(e) => {
                        setSelectedUsers([]);
                        setData('message_provider_id', e.target.value);
                    }}
                    providerId={data.message_provider_id}
                />

                {data.message_provider_id && (
                    <React.Fragment>
                        <UserSearcher
                            userApiSearcher={searchUsersWithProviders}
                            handleUserSelect={handleUserSelect}
                            cleanValueAfterSelect={true}
                        />
                        <label className="mb-2 block text-sm font-bold text-gray-700">
                            Selected Users
                        </label>
                        {renderSelectedUsers()}
                    </React.Fragment>
                )}

                {Object.keys(selectedUsers).length > 0 && (
                    <MessageContent
                        message={data.content}
                        handleContentChange={(e) => {
                            setData('content', e.target.value);
                        }}
                    />
                )}

                {Object.keys(selectedUsers).length > 0 && data.content && (
                    <button
                        type="submit"
                        className="rounded-lg bg-blue-500 px-4 py-2 text-white"
                        disabled={processing}
                    >
                        Send Message
                    </button>
                )}
            </form>
        </div>
    );
}
