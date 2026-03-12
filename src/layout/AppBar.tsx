import {
  AppBar, Box, Toolbar,
  IconButton, Typography
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
    <AppBar position='fixed' elevation={2}
      sx={{
        backgroundColor: (t) => t.palette.primary.main,
        ml: open ? `${drawerWidth}px` : 0,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        width: open ? `calc(100% - ${drawerWidth}px)` : '100%',
        zIndex: (theme) => theme.zIndex.drawer + 1 ,
        transition: theme =>
          theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.easeIn,
            duration: theme.transitions.duration.shortest,
          }),
      }}>
      <Toolbar disableGutters variant="dense" sx={{
            borderBottomRightRadius: 1,
            borderBottomLeftRadius: 1,
            backgroundColor: 'transparent',
            display: 'flex',
            alignContent: 'center',
            color: 'grey',
          }}>
            <IconButton size='large' edge="end" color='inherit'
              onClick={onToggleDrawer}>
              <MenuIcon sx={{
                color: 'white'
              }} />
            </IconButton>

            <Box sx={{ flexGrow: 1 }}/>

            <Typography component={'h4'} fontWeight={600}
              sx={{
                fontWeight: 'bold',
                color: 'white'
              }}>
                S.I GESTION DE INVENTARIO
            </Typography>

            <Box sx={{ flexGrow: 1 }}/>

            <Box
              component={"img"}
              src={logo}
              sx={{
                width: '40px',
                mr: 2
              }}
            />
      </Toolbar>
    </AppBar>
  )
}