import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { useState } from 'react';
import SendMultipleMessage from './Partials/SendMultipleMessage';
import SendOneMessage from './Partials/SendOneMessage';

export default function Create({ auth }) {
    const [messageType, setMessageType] = useState(null);

    const resetView = () => {
        setMessageType(null);
        setProviders([]);
        setSelectedUser(null);
        setData('content', '');
        setData('message_provider_id', '');
        setData('recipient_id', '');
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
                                <SendOneMessage
                                    handleSubmitFinished={resetView}
                                />
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
