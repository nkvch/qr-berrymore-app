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
  FormControlLabel
} from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import Link from 'next/link';
import { useContext, useState } from "react";
import Image from 'next/image';
import { TransitionGroup } from 'react-transition-group';
import Context from './context';
import Notifications from './components/Notifications';
import ThemeSwitch from './components/ThemeSwitch';

const Wrapper = ({ children, title, menuItems, subTitle }) => {
  const { user, logout, mode, setMode } = useContext(Context);

  const [sidebar, setSidebar] = useState(false);

  const switchSidebar = () => setSidebar(!sidebar);

  const switchTheme = (_, isDark) => {
    const theme = isDark ? 'dark' : 'light';
    localStorage.setItem('colorTheme', theme);
    setMode(theme);
  };
  
  return (
    <div className={`container ${mode === 'dark' ? 'darkThemed' : ''}`}>
      <AppBar position="static">
        <Toolbar style={{ backgroundColor: mode === 'light' ? 'white' : '#121212' }}>
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
              <h1 className={`${styles.heading} ${mode === 'dark' ? 'darkThemed': ''}`}>{title}  |</h1>
            <TransitionGroup>
                {
                  subTitle && (
                    <Collapse orientation="horizontal" key={subTitle}>
                      <h1 className={`${styles.heading} ${mode === 'dark' ? 'darkThemed': ''}`}>{subTitle}</h1>
                    </Collapse>
                  )
                }
            </TransitionGroup>
          </Typography>
          <FormControlLabel
            control={<ThemeSwitch sx={{ m: 1 }}
              checked={mode === 'dark'}
              onChange={switchTheme}
            />}
            label={mode === 'dark' ? 'Night theme' : 'Day theme'}
            style={{
              color: mode === 'dark' ? 'white' : 'black',
            }}
          />
          {
            user && <Button variant="text" onClick={logout}>Log out</Button>
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
      {/* <TransitionGroup>
          {
            <Collapse key={children.type.name}>
              {children}
            </Collapse>
          }
      </TransitionGroup> */}
      {children}
    </div>
  )
};

export default Wrapper;
