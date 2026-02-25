import {
  Box, Container, Tooltip, Fade, Typography,
  Grid, IconButton
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import RequestGraph from '../../../services/requestGraph';
import { queries } from '../../../services/endPoints';
import { formateDate } from '../../../helpers/helpers';
import { useEffect, useState } from 'react';
import { type GridCellParams, GridActionsCellItem, GridActionsCell } from '@mui/x-data-grid-premium'
import {
  DeleteOutlined, EditNoteOutlined,  AddRounded,
  ArrowBackRounded
} from '@mui/icons-material'
import type { GridColDef } from '@mui/x-data-grid';
import {
  DataGridPremium, ToolbarButton
} from '@mui/x-data-grid-premium';
import CustomToolbar from '../../ToolbarGrid';
import SubCategoriaCreate from './SubCategoriaCreate';

// TYPES
type AnyRow = Record<string, unknown> & { id: string | number }

type Details = {
  idCategoria: number,
  nombreCategoria: string,
  descripcion?: string | null,
  fechaRegistro: string,
  usuarioRegistro: string,
  codigoSubCategoria: string,
  subCategorias: []
}

const requestGraph = new RequestGraph
async function getCategoryDetails(id: number) {
  try {
    const result = await requestGraph.queryGraph(
      queries.GET_CATEGORIA_BY_ID,
      { idCategoria: id }
    )

    return result.finCategoryById
  } catch (error) {
    console.error("Error cargando productos:", error);
  }
}


function InfoItem({ label, value }: { label: string; value?: string | null }) {

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
      >
        {value || '—'}
      </Typography>
    </Box>
  );
}

export default function DetailsCategory() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [isEdit, setEdit] = useState(false)
  const [categoryDetails, setCategoryDetails] = useState<Details | null>(null);
  const [openCreate, setOpenCreate] = useState(false);
  const [loading, setLoading] = useState(false)
  const [rows, setRows] = useState<AnyRow[]>([])
  const [conlumns, setColumns] = useState<GridColDef[]>([])

  const headersSubCat: GridColDef[] = [{
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
              setEdit(true)
              setOpenCreate(true)
            }}
          />
        </GridActionsCell>
      ),
    }, {
      field: 'nombre',
      headerAlign: 'center',
      align: 'center',
      resizable: true,
      flex: 1,
      headerName: 'Nombre SubCategoria',
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
    },
  ]

  const load = async(alive: boolean) => {
    try {
      setLoading(true)
      const result = await getCategoryDetails(Number(id))
      setLoading(false)

      setCategoryDetails(result)

      if (!alive) return

      const mappedRows: AnyRow[] = result.subCategorias.map((item: GridColDef, i: number) => {
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
  }

  useEffect(() => {
    let alive = true

    load(alive)
    return () => {
      alive = false
    }
  }, [])

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
              <Grid size={{ xs: 12, lg: 6, md: 6 }}>
                <Box
                  sx={{
                    p: 2.5,
                    borderRadius: 0.5,
                    border: '1px solid',
                    borderColor: 'divider',
                    height: '100%',
                  }}
                >
                  <InfoItem
                    label="Categoría"
                    value={categoryDetails?.nombreCategoria}
                  />
                  <InfoItem
                    label="Descripción"
                    value={categoryDetails?.descripcion}
                  />
                </Box>
              </Grid>

              <Grid size={{ xs: 12, lg: 6, md: 6 }}>
                <Box
                  sx={{
                    p: 2.5,
                    borderRadius: 0.5,
                    border: '1px solid',
                    borderColor: 'divider',
                    height: '100%',
                  }}
                >
                  <InfoItem
                    label="Fecha de Registro"
                    value={formateDate(categoryDetails?.fechaRegistro ?? '', true)}
                  />
                  <InfoItem
                    label="Usuario Registro"
                    value={categoryDetails?.usuarioRegistro}
                  />
                </Box>
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
                  title: `SUBCATEGORIAS - ${categoryDetails?.codigoSubCategoria}`,
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
          <SubCategoriaCreate open={openCreate} onClose={() => {
            setOpenCreate(false)
            setEdit(false)
            load(true)
          }} idCategoria={Number(id)} isEdit={isEdit}/>
        </Container>
      </Box>
    </Fade>

  );
}