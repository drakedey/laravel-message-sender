import React from 'react';

export default function ProvidersSelectors({
    handleProviderSelect,
    providers,
    providerId,
}) {
    return (
        <React.Fragment>
            <div>
                <label className="mb-2 block text-sm font-bold text-gray-700">
                    Select Provider
                </label>
                <select
                    className="w-full rounded-lg border px-3 py-2"
                    value={providerId}
                    onChange={handleProviderSelect}
                >
                    <option value="">Select a provider</option>
                    {providers.map((provider) => (
                        <option key={provider.id} value={provider.id}>
                            {provider.name}
                        </option>
                    ))}
                </select>
            </div>
        </React.Fragment>
    );
}
