import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import type React from 'react';
import { onFileSelected } from '../helpers/helpers.tsx';

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});

type Props = {
    onSuccess: (imgBase64: string) => void
}

export default function InputFileUpload({ onSuccess }: Props) {
    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const base64 = await onFileSelected(event)

        if (base64) {
            onSuccess(base64)
        }
    }

    return (
        <Button
            component="label"
            role={undefined}
            variant="contained"
            tabIndex={-1}
            startIcon={<CloudUploadIcon />}
            sx={{
                mb: 1
            }}
        >
            Subir imagen
            <VisuallyHiddenInput
                type="file"
                onChange={handleFileChange}
                multiple
            />
        </Button>
    );
}