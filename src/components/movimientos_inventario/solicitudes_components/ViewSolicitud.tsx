import {
    Box, Dialog, DialogTitle,
    DialogContent, DialogActions,
    Button, Typography, Grid,
    Table, TableBody, TableCell,
    TableContainer, TableHead,
    TableRow, Paper, Chip, Stack,
    IconButton
} from '@mui/material';
import { InfoRounded, CloseRounded, PrintRounded,
    LocationOnRounded,
    ProductionQuantityLimits
} from '@mui/icons-material';
import { type detalleSolicitud, type SolicitudByID } from '../../../helpers/types';
import { queries } from '../../../services/endPoints';
import RequestGraph from '../../../services/requestGraph';
import useSWR from 'swr';

const requestGraph = new RequestGraph

export default function ViewSolicitud ({ open, onClose, id }: {
    open: boolean,
    onClose: () => void,
    id: number
}){
    const fetcher = async ([query, variables]: [string, number]) => {
        const result = await requestGraph.queryGraph(query, variables)
        return result?.findSolicitudById ?? null;
    }

    const formatCurrency = (amount: number) =>
        new Intl.NumberFormat('en-NI', { style: 'currency', currency: 'NIO' }).format(amount);

    const { data, isLoading } = useSWR(
        [queries.GET_SOLICITUDES_BY_ID, { idSolicitud: Number(id) }],
        fetcher,
        {
            revalidateOnFocus: false,
            revalidateOnReconnect: true,
            shouldRetryOnError: false,
            onSuccess: async (data: SolicitudByID) => {
                return data
            }
        }
    )


    if (isLoading || !data) return

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="md"
            fullWidth
        >
            {/* Título con Botón de Cerrar */}
            <DialogTitle sx={{
                m: 0, p: 2,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                bgcolor: 'grey.50',
                borderBottom: '1px solid',
                borderColor: 'divider'
            }}>
                <Stack direction="row" spacing={1} alignItems="center">
                    <InfoRounded color="primary" />
                    <Typography variant="h6" fontWeight="bold">
                        Solicitud: {data.codigoSolicitud}
                    </Typography>
                </Stack>
                <IconButton onClick={onClose} size="small">
                    <CloseRounded />
                </IconButton>
            </DialogTitle>

            <DialogContent sx={{ p: 3 }}>
                {/* Fila Superior: Datos Clave */}
                <Grid container spacing={3} sx={{ mb: 4, mt: 0.5 }}>
                    <Grid size={{ xs: 12, sm: 4 }}>
                        <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
                            SOLICITANTE
                        </Typography>
                        <Typography variant="body1" fontWeight="500">{data.solicitante}</Typography>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 4 }}>
                        <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
                            FECHA DE REGISTRO
                        </Typography>
                        <Typography variant="body1">
                            {new Date(data.fechaRegistro).toLocaleDateString()} 
                            <Typography component="span" variant="caption" color="text.secondary"> 
                                {` - ${new Date(data.fechaRegistro).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`}
                            </Typography>
                        </Typography>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 4 }}>
                        <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
                            ESTADO ACTUAL
                        </Typography>
                        <Chip
                            label="GENERADA"
                            color="info"
                            size="small"
                            sx={{ fontWeight: 'bold', borderRadius: '6px' }}
                        />
                    </Grid>
                </Grid>

                {/* Sección: Ubicaciones con Estilo de Card */}
                <Typography variant="subtitle2" sx={{ mb: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <LocationOnRounded fontSize="small" />
                    FLUJO DE INVENTARIO
                </Typography>
                <Grid container spacing={2} sx={{ mb: 4 }}>
                    {[
                        { label: 'ORIGEN (Solicitante)', bodega: data.bodegaSolicitante },
                        { label: 'DESTINO (Solicitada)', bodega: data.bodegaSolicitada }
                    ].map((item, index) => (
                        <Grid size={{ xs: 12, sm: 6 }} key={index}>
                            <Box sx={{
                                p: 2, borderRadius: 1,
                                bgcolor: 'action.hover',
                                border: '1px solid',
                                borderColor: 'divider'
                            }}>
                                <Typography variant="caption" fontWeight="bold" color="primary" display="block">
                                    {item.label}
                                </Typography>
                                <Typography variant="body2" fontWeight="600">
                                    {item.bodega.nombreBodega}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                    {item.bodega.ubicacion.nombreUbicacion}
                                </Typography>
                            </Box>
                        </Grid>
                    ))}
                </Grid>

                {/* Sección: Tabla */}
                <Typography variant="subtitle2" sx={{ mb: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <ProductionQuantityLimits fontSize="small" /> PRODUCTOS SOLICITADOS
                </Typography>

                <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 1, overflow: 'hidden' }}>
                    <Table size="small">
                        <TableHead sx={{ bgcolor: 'grey.100' }}>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 'bold' }}>Código</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Producto</TableCell>
                                <TableCell align="right" sx={{ fontWeight: 'bold' }}>Cant.</TableCell>
                                <TableCell align="right" sx={{ fontWeight: 'bold' }}>Unitario</TableCell>
                                <TableCell align="right" sx={{ fontWeight: 'bold' }}>Total</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {data.detalleSolicitud.map((item: detalleSolicitud) => (
                                <TableRow key={item.idDetalleSolicitud} hover>
                                    <TableCell>
                                        <Typography variant="body2" fontFamily="monospace">
                                            {item.producto.codigoProducto}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>{item.producto.nombreProducto}</TableCell>
                                    <TableCell align="right">{item.cantidad}</TableCell>
                                    <TableCell align="right">{formatCurrency(item.precioUnitario)}</TableCell>
                                    <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                                        {formatCurrency(item.cantidad * item.precioUnitario)}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                {/* Observaciones */}
                {data.observaciones && (
                    <Box sx={{ mt: 3, p: 2, bgcolor: 'orange.50', borderRadius: 1, borderLeft: '4px solid orange' }}>
                        <Typography variant="caption" fontWeight="bold" color="warning.main" display="block">
                            OBSERVACIONES
                        </Typography>
                        <Typography variant="body2" color="text.primary">
                        {data.observaciones}
                        </Typography>
                    </Box>
                )}
            </DialogContent>

            <DialogActions sx={{ p: 2, bgcolor: 'grey.50', borderTop: '1px solid', borderColor: 'divider' }}>
                <Button onClick={onClose} color="inherit" variant="text">
                    Cerrar
                </Button>
                <Button
                    onClick={() => window.print()}
                    variant="contained"
                    startIcon={<PrintRounded />}
                    sx={{ borderRadius: .5 }}
                >
                    Imprimir
                </Button>
            </DialogActions>
        </Dialog>
    );
};