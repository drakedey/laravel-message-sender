export default function MessageContent({ message, handleContentChange }) {
    return (
        <div>
            <label className="mb-2 block text-sm font-bold text-gray-700">
                Message
            </label>
            <textarea
                className="w-full rounded-lg border px-3 py-2"
                rows="4"
                value={message}
                onChange={handleContentChange}
            />
        </div>
    );
}
