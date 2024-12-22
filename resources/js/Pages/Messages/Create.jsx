import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import axios from 'axios';
import debounce from 'lodash/debounce';
import { useState } from 'react';

export default function Create({ auth }) {
    const [messageType, setMessageType] = useState(null); // 'single' or 'multiple'
    const [searchTerm, setSearchTerm] = useState('');
    const [users, setUsers] = useState([]);
    const [providers, setProviders] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [showUserDropdown, setShowUserDropdown] = useState(false);

    const { data, setData, post, processing, errors } = useForm({
        content: '',
        message_provider_id: '',
        recipient_id: '',
    });

    // Debounced search function
    const searchUsers = debounce(async (search) => {
        if (search.length < 2) return;

        try {
            const response = await axios.get(route('messages.search-users'), {
                params: { search },
            });
            setUsers(response.data);
            setShowUserDropdown(true);
        } catch (error) {
            console.error('Error searching users:', error);
        }
    }, 300);

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
        setSearchTerm(user.email);
        setShowUserDropdown(false);
        setData('recipient_id', user.id);
        fetchUserProviders(user.id);
    };

    const resetView = () => {
        setMessageType(null);
        setSearchTerm('');
        setUsers([]);
        setProviders([]);
        setSelectedUser(null);
        setShowUserDropdown(false);
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
                                        <label className="mb-2 block text-sm font-bold text-gray-700">
                                            Search User by Email
                                        </label>
                                        <input
                                            type="text"
                                            className="w-full rounded-lg border px-3 py-2"
                                            value={searchTerm}
                                            onChange={(e) => {
                                                setSearchTerm(e.target.value);
                                                searchUsers(e.target.value);
                                            }}
                                            placeholder="Type email to search..."
                                        />

                                        {/* Users Dropdown */}
                                        {showUserDropdown &&
                                            users.length > 0 && (
                                                <div className="z-10 mt-1 w-full rounded-lg border bg-white shadow-lg">
                                                    {users.map((user) => (
                                                        <div
                                                            key={user.id}
                                                            className="cursor-pointer px-4 py-2 hover:bg-gray-100"
                                                            onClick={() =>
                                                                handleUserSelect(
                                                                    user,
                                                                )
                                                            }
                                                        >
                                                            <div>
                                                                {user.name}
                                                            </div>
                                                            <div className="text-sm text-gray-600">
                                                                {user.email}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                    </div>

                                    {/* Provider Selection - Only show if user is selected */}
                                    {selectedUser && (
                                        <div>
                                            <label className="mb-2 block text-sm font-bold text-gray-700">
                                                Select Provider
                                            </label>
                                            <select
                                                className="w-full rounded-lg border px-3 py-2"
                                                value={data.message_provider_id}
                                                onChange={(e) =>
                                                    setData(
                                                        'message_provider_id',
                                                        e.target.value,
                                                    )
                                                }
                                            >
                                                <option value="">
                                                    Select a provider
                                                </option>
                                                {providers.map((provider) => (
                                                    <option
                                                        key={provider.id}
                                                        value={provider.id}
                                                    >
                                                        {provider.name}
                                                    </option>
                                                ))}
                                            </select>
                                            {errors.message_provider_id && (
                                                <div className="mt-1 text-sm text-red-500">
                                                    {errors.message_provider_id}
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* Message Content - Only show if provider is selected */}
                                    {data.message_provider_id && (
                                        <div>
                                            <label className="mb-2 block text-sm font-bold text-gray-700">
                                                Message
                                            </label>
                                            <textarea
                                                className="w-full rounded-lg border px-3 py-2"
                                                rows="4"
                                                value={data.content}
                                                onChange={(e) =>
                                                    setData(
                                                        'content',
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                            {errors.content && (
                                                <div className="mt-1 text-sm text-red-500">
                                                    {errors.content}
                                                </div>
                                            )}
                                        </div>
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
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
