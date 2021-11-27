import styles from '../styles/Wrapper.module.scss';
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
import Link from 'next/link';
import { useState } from "react";
import Image from 'next/image';

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
            <img src="https://cdn-icons.flaticon.com/png/512/4861/premium/4861890.png?token=exp=1637415695~hmac=b48c839dd81d65ba7abfd7614c068ffc" width="30" height="30" />
            { ' ' + title }
          </Typography>
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
      {children}
    </div>
  )
};

export default Wrapper;
