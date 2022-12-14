import { useEffect, useState } from 'react';
import Context from './context';
import Wrapper from './Wrapper';
import EqualizerIcon from '@mui/icons-material/Equalizer';
import PeopleIcon from '@mui/icons-material/People';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import ManageSearchIcon from '@mui/icons-material/ManageSearch';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import { Download } from '@mui/icons-material';
import request from './utils/request';
import sleep from './utils/sleep';
import AddTaskIcon from '@mui/icons-material/AddTask';
import router, { useRouter } from 'next/router';
import { ThemeProvider, createTheme } from '@mui/material/styles';

const unauthMenuOptions = [{
  text: 'Sign in',
  linkUrl: '/signin',
  icon: <ExitToAppIcon />,
}];

const authMenuOptions = [{
  text: 'Employees',
  linkUrl: '/employees',
  icon: <PeopleIcon />,
}, {
  text: 'Products',
  linkUrl: '/products',
  icon: <ManageSearchIcon />,
}, {
  text: 'Foremen',
  linkUrl: '/foremen',
  icon: <SupervisorAccountIcon />,
}, {
  text: 'Statistics',
  linkUrl: '/stats',
  icon: <EqualizerIcon />,
}, {
  text: 'New portion',
  linkUrl: '/new-portion',
  icon: <AddTaskIcon />,
}, {
  text: 'Download app',
  linkUrl: '/download',
  icon: <Download />,
}];

const ContextWrapper = ({ children }) => {
  const { pathname } = useRouter();
  const [user, setUser] = useState(null);
  const [subTitle, setSubTitle] = useState(null);
  const [mode, setMode] = useState('light');

  const darkTheme = createTheme({
    palette: {
      mode: mode,
    },
  });

  useEffect(() => {
    const themeFromLS = localStorage.getItem('colorTheme');

    if (themeFromLS) {
      setMode(themeFromLS);
    }
  }, []);

  const login = (token, user) => {
    localStorage.setItem('jwt', token);
    setUser(() => user);
  };

  const logout = () => {
    localStorage.removeItem('jwt');
    setUser(() => null);

    router.push('/signin');
  };

  useEffect(() => {
    request({
      url: '/auth',
      callback: (status, response) => {
        if (status === 'ok') {
          
          const { token, ...userData } = response.data;

          login(token, userData);
        } else if (status === 'error') {
          logout();
        }
      }
    });
  }, [pathname]);

  const updateSubTitle = async newSubTitle => {
    await sleep(500);
    setSubTitle(null);
    await sleep(600);
    setSubTitle(newSubTitle);
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <Context.Provider value={{ user, login, logout, updateSubTitle, mode, setMode }}>
        <title>{`Berrymore${subTitle ? `|${subTitle}` : ''}`}</title>
        <Wrapper
          title="Berrymore"
          menuItems={
            user
            ? authMenuOptions
            : unauthMenuOptions
          }
          subTitle={subTitle}
        >
            {children}
        </Wrapper>
      </Context.Provider>
    </ThemeProvider>
  );
};

export default ContextWrapper;
