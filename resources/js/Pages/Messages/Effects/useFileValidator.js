import { useState } from 'react';

export default function useFileValidator() {
    const [fileError, setFileError] = useState(null);

    const validateFile = (file, maxFileSize) => {
        if (!file) {
            setFileError(null);
            return true;
        }

        if (file.size > maxFileSize) {
            setFileError(
                `Archivo superado, el tamaño maximo es: ${maxFileSize / 1024 / 1024}MB`,
            );
            return false;
        }

        setFileError(null);
        return true;
    };

    return { fileError, validateFile };
}
