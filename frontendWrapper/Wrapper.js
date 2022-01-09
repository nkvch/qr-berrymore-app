import styles from '../styles/Wrapper.module.scss';
import {
  Alert,
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
  AlertTitle,
  Collapse,
  Button,
  CircularProgress,
} from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import Link from 'next/link';
import { useContext, useState } from "react";
import Image from 'next/image';
import { TransitionGroup } from 'react-transition-group';
import Context from './context';
import Notifications from './components/notifications';

const Wrapper = ({ children, title, menuItems }) => {
  const { user, logout } = useContext(Context);

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
          <Typography className="text topbartitle" display="flex" variant="h6" component="div" sx={{ flexGrow: 1 }}>
            <Image alt="icon" src="/icon.svg" width="40" height="40" />
            <h1 className={styles.heading}>{title}</h1>
          </Typography>
          {
            user && <Button variant="text" onClick={logout}>Выйти</Button>
          }
        </Toolbar>
      </AppBar>
      <Drawer
        anchor="left"
        open={sidebar}
        onClose={switchSidebar}
      >
        <Box sx={{
          width: 300
        }}>
          <List>
            {
              menuItems.map(({ text, icon, linkUrl }) => (
                <ListItem button key={text} onClick={switchSidebar}>
                  <Link href={linkUrl}>
                    <a className={styles.menuLink}>
                      <ListItemIcon>{icon}</ListItemIcon>
                      <ListItemText primary={text} />
                    </a>
                  </Link>
                </ListItem>
              ))
            }
          </List>
        </Box>
      </Drawer>
      <Notifications />
      {children}
    </div>
  )
};

export default Wrapper;
