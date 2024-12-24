import useFileValidator from '../Effects/useFileValidator';

export default function MessageContent({
    message,
    handleContentChange,
    handleFileChange,
    maxFileSize,
}) {
    const { fileError, validateFile } = useFileValidator();

    const innerHandleFileChange = (e) => {
        if (!validateFile(e.target.files[0], maxFileSize)) {
            e.target.value = '';
            return;
        }
        handleFileChange(e);
    };

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
            <label className="mb-2 mt-4 block text-sm font-bold text-gray-700">
                File
            </label>
            <input
                type="file"
                className="w-full rounded-lg border px-3 py-2"
                onChange={innerHandleFileChange}
            />
            {fileError && (
                <p className="mt-2 text-sm text-red-500">{fileError}</p>
            )}
        </div>
    );
}
