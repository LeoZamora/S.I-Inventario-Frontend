import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import { Slide  } from '@mui/material';

type Props = {
    severity: "success" | "info" | "warning" | "error";
    message: string;
}

export default function AlertComp({ severity, message }: Props) {
    return (
        <Stack
            sx={{
                width: "100%",
                position: "fixed",
                top: { xs: '56px', sm: '64px' },
                left: 0,
                zIndex: 10000,
                display: 'flex',
                alignItems: 'end',
                pointerEvents: 'none',
                mr: 2
            }}
        >
            <Slide direction='left' timeout={250} in>
                <Alert
                    severity={severity}
                    variant="filled"
                    sx={{
                        mr: 1,
                        // background: "white",
                        pointerEvents: 'auto',
                        boxShadow: 3,
                        minWidth: '300px',
                        maxWidth: '90%'
                    }}
                >
                    {message}
                </Alert>
            </Slide >
        </Stack>
    );
}