import {
  AppBar, Box, Toolbar,
  IconButton, Typography, Divider
} from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'


type Props = {
  open: boolean,
  drawerWidth: number,
  onToggleDrawer: () => void,
  logo: string,
}

export default function AppBarLayout({open, drawerWidth, onToggleDrawer, logo}: Props) {
  return (
    <AppBar position='fixed' elevation={0}
      sx={{
        backgroundColor: 'transparent',
        // borderBottom: '1px solid #E0E0E0',
        ml: open ? `${drawerWidth}px` : 0,
        width: open ? `calc(100% - ${drawerWidth}px)` : '100%',
        zIndex: (theme) => theme.zIndex.drawer + 1 ,
        transition: theme =>
          theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.easeIn,
            duration: theme.transitions.duration.shortest,
          }),
      }}>
      <Toolbar disableGutters variant="dense" sx={{
            backgroundColor: 'transparent',
            display: 'flex',
            alignContent: 'center',
            color: 'grey',
          }}>
            <Divider sx={{ my: 2, color: 'black', backgroundColor: 'black' }} orientation='vertical'/>
            <IconButton size='large' edge="end" color='inherit'
              onClick={onToggleDrawer}>
              <MenuIcon />
            </IconButton>

            <Box sx={{ flexGrow: 1 }}/>

            <Typography component={'h4'} fontWeight={600}
              sx={{
                fontWeight: 'bold'
              }}>
                S.I GESTION DE INVENTARIO
            </Typography>

            <Box sx={{ flexGrow: 1 }}/>

            <Box
              component={"img"}
              src={logo}
              sx={{
                width: '100px',
                mr: 2
              }}
            />
      </Toolbar>
    </AppBar>
  )
}