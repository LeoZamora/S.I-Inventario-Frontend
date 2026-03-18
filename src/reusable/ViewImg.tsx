import { Card } from '@mui/material';
import { Dialog, DialogTitle, DialogActions,
    Button, DialogContent
} from "@mui/material"

type Props = {
    img: string
    open: boolean
    onClose: () => void
}

export default function ImgViewer({ open, img, onClose }: Props) {
    return (
        <Dialog open={open} maxWidth="lg" onClose={() => onClose}
            disableRestoreFocus
            disableEscapeKeyDown
            autoFocus
            sx={{
                "& .MuiDialog-paper": {
                    borderRadius: 1,
                    width: '600px',
                },
            }}
        >
            <DialogTitle sx={{
                    "&.MuiDialogTitle-root": {
                        paddingBottom: 0
                    },
                    "&.MuiDialogContent-root": {
                        paddingTop: 2
                    }
                }}
            >
                Imagen del Producto
            </DialogTitle>

            <DialogContent>
                <Card>
                    <img src={img} />
                </Card>
            </DialogContent>

            <DialogActions>
                <Button onClick={() => {
                    onClose()
                }} color="secondary"
                    sx={{
                        "&.MuiButtonBase-root": {
                            borderRadius: .5
                        }
                    }}
                >
                    Cerrar
                </Button>
            </DialogActions>
        </Dialog>
    )
}