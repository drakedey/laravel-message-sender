import debounce from 'lodash/debounce';
import React, { useState } from 'react';

export default function UserSearcher({
    userApiSearcher,
    handleUserSelect,
    cleanValueAfterSelect,
}) {
    const [searchTerm, setSearchTerm] = useState('');
    const [users, setUsers] = useState([]);
    const [showUserDropdown, setShowUserDropdown] = useState(false);

    const searchUsers = debounce(async (search) => {
        try {
            const response = await userApiSearcher(search);
            setUsers(response);
            setShowUserDropdown(true);
        } catch (error) {
            console.error('Error searching users:', error);
        }
    }, 300);

    const handleUserSelectInternally = (user) => {
        if (!cleanValueAfterSelect) setSearchTerm(user.email);
        else setSearchTerm('');
        setShowUserDropdown(false);
        handleUserSelect(user);
    };

    return (
        <React.Fragment>
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
            {showUserDropdown && users && users.length > 0 && (
                <div className="z-10 mt-1 w-full rounded-lg border bg-white shadow-lg">
                    {users.map((user) => (
                        <div
                            key={user.id}
                            className="cursor-pointer px-4 py-2 hover:bg-gray-100"
                            onClick={() => handleUserSelectInternally(user)}
                        >
                            <div>{user.name}</div>
                            <div className="text-sm text-gray-600">
                                {user.email}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </React.Fragment>
    );
}
