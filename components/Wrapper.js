import {
  AppBar,
  IconButton,
  Toolbar,
  Typography,
  Drawer,
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import { useState } from "react";
import HomeIcon from '@mui/icons-material/Home';
import EqualizerIcon from '@mui/icons-material/Equalizer';
import PeopleIcon from '@mui/icons-material/People';

const icons = {
  'Кабинет': <HomeIcon />,
  'Статистика': <EqualizerIcon />,
  'Сотрудники': <PeopleIcon />,
};

const Wrapper = ({ children, title, menuItems }) => {

  const [sidebar, setSidebar] = useState(false);

  const switchSidebar = () => setSidebar(!sidebar);

  return (
    <div className="container">
      <AppBar position="static">
        <Toolbar style={{ backgroundColor: 'white' }}>
          <IconButton
            size="large"
            edge="start"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={switchSidebar}
          >
            <MenuIcon />
          </IconButton>
          <Typography className="text topbartitle" variant="h6" component="div" sx={{ flexGrow: 1 }}>
            { title }
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        anchor="left"
        open={sidebar}
        onClose={switchSidebar}
      >
        <Box sx={{
          width: 200
        }}>
          <List>
            {
              menuItems.map(menuItem => (
                <ListItem button key={menuItem}>
                  <ListItemIcon>{icons[menuItem]}</ListItemIcon>
                  <ListItemText primary={menuItem} />
                </ListItem>
              ))
            }
          </List>
        </Box>
      </Drawer>
      {children}
    </div>
  )
};

export default Wrapper;
