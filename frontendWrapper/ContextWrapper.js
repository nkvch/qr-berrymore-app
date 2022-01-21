import { useEffect, useState } from 'react';
import Context from './context';
import Wrapper from './Wrapper';
import HomeIcon from '@mui/icons-material/Home';
import EqualizerIcon from '@mui/icons-material/Equalizer';
import PeopleIcon from '@mui/icons-material/People';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import ManageSearchIcon from '@mui/icons-material/ManageSearch';
import request from './utils/request';
import notifications from './components/notifications';
import sleep from './utils/sleep';

const unauthMenuOptions = [{
  text: 'Зарегистрироваться',
  linkUrl: '/signup',
  icon: <AssignmentIndIcon />,
}, {
  text: 'Войти',
  linkUrl: '/signin',
  icon: <ExitToAppIcon />,
}];

const authMenuOptions = [{
  text: 'База сотрудников',
  linkUrl: '/employees',
  icon: <PeopleIcon />,
}, {
  text: 'База продуктов',
  linkUrl: '/products',
  icon: <ManageSearchIcon />,
}, {
  text: 'Обзор по дням',
  linkUrl: '/observe',
  icon: <EqualizerIcon />,
}, {
  text: 'Кабинет',
  linkUrl: '/office',
  icon: <HomeIcon />,
}];

const ContextWrapper = ({ children }) => {
  const [user, setUser] = useState(null);
  const [addTitle, setAddTitle] = useState(null);

  const login = (token, user) => {
    localStorage.setItem('jwt', token);
    setUser(() => user);
  };

  const logout = () => {
    localStorage.removeItem('jwt');
    setUser(() => null);
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
  }, []);

  const updateAddTitle = async newAddTitle => {
    await sleep(500);
    setAddTitle(null);
    await sleep(600);
    setAddTitle(newAddTitle);
  };

  return (
    <Context.Provider value={{ user, login, logout, updateAddTitle }}>
      <Wrapper
        title="Berrymore"
        menuItems={
          user
          ? authMenuOptions
          : unauthMenuOptions
        }
        addTitle={addTitle}
      >
          {children}
      </Wrapper>
    </Context.Provider>
  );
};

export default ContextWrapper;
