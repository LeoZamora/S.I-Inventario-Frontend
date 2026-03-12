import {
  Box, Container, Tooltip, Fade, Typography,
  Grid, IconButton, Chip
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import RequestGraph from '../../../services/requestGraph';
import { queries } from '../../../services/endPoints';
import { formateDate } from '../../../helpers/helpers';
import { useEffect, useState, useMemo, useCallback } from 'react';
import { type GridCellParams, GridActionsCellItem, GridActionsCell } from '@mui/x-data-grid-premium'
import {
  DeleteOutlined, EditNoteOutlined,  AddRounded,
  ArrowBackRounded
} from '@mui/icons-material'
import type { GridColDef } from '@mui/x-data-grid';
import {
  DataGridPremium, ToolbarButton
} from '@mui/x-data-grid-premium';
import CustomToolbar from '../../../reusable/ToolbarGrid';
import BodegaCreate from './BodegaCreate';

// TYPES
type AnyRow = Record<string, unknown> & { id: string | number }

type Details = {
  idUbicacion: number,
  nombreUbicacion: string,
  direccion?: string | null,
  fechaRegistro: string,
  usuarioRegistro: string,
  codigoUbicacion: string,
  estado: number,
  bodegas: []
}

const requestGraph = new RequestGraph
async function getUbicacionDetails(id: number) {
  try {
    const result = await requestGraph.queryGraph(
      queries.GET_UBICACION_BY_ID,
      { idUbicacion: id }
    )

    return result.findUbicacionById
  } catch (error) {
    console.error("Error cargando productos:", error);
  }
}

function InfoItem({ label, value }: { label: string; value?: string | number | null }) {
  const renderContent = () => {
    if (value === 0 || value === 1) {
      return (
        <Chip
          label={value === 1 ? 'Activo' : 'Inactivo'}
          color={value === 1 ? 'success' : 'error'}
          variant="outlined"
        />
      );
    }

    // Manejo de valores nulos o vacíos, y el resto de valores
    return value ?? '—';
  };

  return (
    <Box sx={{ mb: 1 }}>
      <Typography
        variant="caption"
        sx={{
          fontWeight: 600,
          color: 'text.primary',
          display: 'block',
          mb: 0.5,
        }}
      >
        {label}
      </Typography>

      <Typography
        variant="body2"
        color="text.secondary"
        component="div"
      >
        {renderContent()}
      </Typography>
    </Box>
  );
}

export default function DetailsUbicacion() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [idSubCategoria, setIdSubCategoria] = useState(null)
  const [isEdit, setEdit] = useState(false)
  const [ubicacionDetails, setUbicacionDetails] = useState<Details | null>(null);
  const [openCreate, setOpenCreate] = useState(false);
  const [loading, setLoading] = useState(false)
  const [rows, setRows] = useState<AnyRow[]>([])
  const [conlumns, setColumns] = useState<GridColDef[]>([])

  const headersSubCat: GridColDef[] = useMemo(() => [{
      field: 'opc',
      headerAlign: 'center',
      align: 'center',
      sortable: false,
      disableExport: true,
      resizable: true,
      flex: 0.5,
      headerName: '',
      headerClassName:'header-classname',
      renderCell: (params) => (
        <GridActionsCell {...params}>
          <GridActionsCellItem
            icon={<DeleteOutlined />}
            label="Eliminar"
            showInMenu
          />
          <GridActionsCellItem
            icon={<EditNoteOutlined />}
            label="Editar"
            showInMenu
            onClick={() => {
              setIdSubCategoria(params.row.idBodega)
              setEdit(true)
              setOpenCreate(true)
            }}
          />
        </GridActionsCell>
      ),
    }, {
      field: 'codigoBodega',
      headerAlign: 'center',
      align: 'center',
      resizable: true,
      flex: 1,
      headerName: 'Código',
    }, {
      field: 'nombreBodega',
      headerAlign: 'center',
      align: 'center',
      resizable: true,
      flex: 1,
      headerName: 'Nombre Bodega',
    }, {
      field: 'descripcion',
      headerAlign: 'center',
      align: 'center',
      resizable: true,
      flex: 1,
      headerName: 'Descripcion',
    }, {
      field: 'fechaRegistro',
      headerAlign: 'center',
      align: 'center',
      resizable: true,
      flex: 1,
      headerName: 'Fecha Registro',
      renderCell: (params: GridCellParams) => {
        return (
          <span>
            { formateDate(String(params.value), true) }
          </span>
        )
      }
    }, {
      field: 'usuarioRegistro',
      headerAlign: 'center',
      align: 'center',
      resizable: true,
      flex: 1,
      headerName: 'Usuario Registro',
    }, {
      field: 'estado',
      headerAlign: 'center',
      align: 'center',
      resizable: true,
      flex: 1,
      headerName: 'Estado',
      renderCell: (params: GridCellParams) => {
        return (
          <Chip label={params.value ? 'Activo' : 'Inactivo'}
            color={params.value ? 'success' : 'error'}
            variant="outlined"
          />
        )
      }
    },
  ], [])

  const load = useCallback(async(alive: boolean) => {
    try {
      setLoading(true)
      const result = await getUbicacionDetails(Number(id))
      setLoading(false)

      setUbicacionDetails(result)

      if (!alive) return

      const mappedRows: AnyRow[] = result.bodegas.map((item: GridColDef, i: number) => {
        item.align = 'center'
        item.headerAlign = 'center'
        item.resizable = true

        return {
            ...item,
            id: i
        }
      })

      setRows(mappedRows)
      setColumns(headersSubCat)

    } catch (error) {
      console.error("Error cargando productos:", error);
    } finally {
      if (alive) setLoading(false)
    }
  }, [headersSubCat, id])

  useEffect(() => {
    let alive = true

    load(alive)
    return () => {
      alive = false
    }
  }, [load])

  return (
    <Fade in>
      <Box sx={{ width: '100%', height: '100vh',
        borderTop: '1px solid',
        borderColor: 'divider',
      }}>
        <Container sx={{
          width: '100%',
          height: '100%',
          "&.MuiContainer-root": {
            p: 0,
            minWidth: "100%"
          }
        }}>
          <Box
            sx={{
              px: 2,
              pb: 2,
              backgroundColor: 'background.paper',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <Typography variant="h6" fontWeight={600}>
                Datos Generales
              </Typography>

              <Box sx={{ flexGrow: 1 }} />

              <Tooltip title="Volver">
                <IconButton
                  onClick={() => navigate(-1)}
                  sx={{
                    '&:hover': { bgcolor: 'grey.200' },
                  }}
                >
                  <ArrowBackRounded />
                </IconButton>
              </Tooltip>
            </Box>

            <Grid container spacing={2}>
              <Grid size={{ xs: 12, lg: 6, md: 6 }} sx={{
                borderRadius: 0.5,
                border: '1px solid',
                borderColor: 'divider',
              }} container>
                <Grid size={{ xs: 12, lg: 6, md: 12 }}>
                  <Box
                    sx={{
                      p: 2.5,
                      height: '100%',
                    }}
                  >
                    <InfoItem
                      label="Nombre de Ubicación"
                      value={ubicacionDetails?.nombreUbicacion}
                    />
                    <InfoItem
                      label="Dirección"
                      value={ubicacionDetails?.direccion}
                    />
                  </Box>
                </Grid>

                <Grid size={{ xs: 12, lg: 6, md: 12 }}>
                  <Box
                    sx={{
                      p: 2.5,
                      height: '100%',
                    }}
                  >
                    <InfoItem
                      label="Código de Ubicación"
                      value={ubicacionDetails?.codigoUbicacion}
                    />
                    <InfoItem
                      label="Estado"
                      value={ubicacionDetails?.estado}
                    />
                  </Box>
                </Grid>
              </Grid>

              <Grid size={{ xs: 12, lg: 6, md: 6 }} sx={{
                borderRadius: 0.5,
                border: '1px solid',
                borderColor: 'divider',
              }} container>
                <Grid size={{ xs: 12, lg: 6, md: 6 }}>
                  <Box
                    sx={{
                      p: 2.5,
                      borderRadius: 0.5,
                    }}
                  >
                    <InfoItem
                      label="Fecha de Registro"
                      value={formateDate(ubicacionDetails?.fechaRegistro ?? '', true)}
                    />
                    <InfoItem
                      label="Usuario Registro"
                      value={ubicacionDetails?.usuarioRegistro}
                    />
                  </Box>
                </Grid>

                <Grid size={{ xs: 12, lg: 6, md: 6 }}>
                  <Box
                    sx={{
                      p: 2.5,
                      borderRadius: 0.5,
                    }}
                  >
                    <InfoItem
                      label="Fecha Ult. Modificación"
                      value={formateDate(ubicacionDetails?.fechaRegistro ?? '', true)}
                    />
                    <InfoItem
                      label="Usuario Ult. Modificación"
                      value={ubicacionDetails?.usuarioRegistro}
                    />
                  </Box>
                </Grid>
              </Grid>
            </Grid>
          </Box>

          <Box sx={{
              minHeight: 520,
              width: '100%',
            }}
          >
            <DataGridPremium
              showToolbar
              rows={rows}
              columns={conlumns}
              density='compact'
              rowSpacingType='border'
              paginationModel={{
                page: 0,
                pageSize: 10
              }}
              pageSizeOptions={[5, 10]}
              slots={{
                toolbar: CustomToolbar
              }}
              slotProps={{
                loadingOverlay: {
                  variant: 'skeleton',
                  noRowsVariant: 'skeleton'
                },
                toolbar: {
                  title: `BODEGAS`,
                  addButton: (
                    <Tooltip title="Agregar una subcategoria">
                      <ToolbarButton onClick={() => {
                        setOpenCreate(true)
                        setEdit(false)
                      }}>
                        <AddRounded />
                      </ToolbarButton>
                    </Tooltip>
                  )
                }
              }}
              loading={loading}
              sx={{
                borderRadius: 0,
                borderLeft: 0,
                borderRight: 0,
                flexGrow: 1,
                "& .MuiDataGrid-main": { width: '100%' },
              }}
            />
          </Box>
          <BodegaCreate open={openCreate} onClose={() => {
            setOpenCreate(false)
            setEdit(false)
            load(true)
          }} idBodega={Number(idSubCategoria)} idUbicacion={Number(id)} isEdit={isEdit}/>
        </Container>
      </Box>
    </Fade>

  );
}