import { useEffect, useState } from 'react';
import Context from './context';
import Wrapper from './Wrapper';
import EqualizerIcon from '@mui/icons-material/Equalizer';
import PeopleIcon from '@mui/icons-material/People';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import ManageSearchIcon from '@mui/icons-material/ManageSearch';
import request from './utils/request';
import sleep from './utils/sleep';
import AddTaskIcon from '@mui/icons-material/AddTask';
import router, { useRouter } from 'next/router';

const unauthMenuOptions = [{
  text: 'Войти',
  linkUrl: '/signin',
  icon: <ExitToAppIcon />,
}];

const authMenuOptions = [{
  text: 'Сотрудники',
  linkUrl: '/employees',
  icon: <PeopleIcon />,
}, {
  text: 'Продукты',
  linkUrl: '/products',
  icon: <ManageSearchIcon />,
}, {
  text: 'Статистика',
  linkUrl: '/stats',
  icon: <EqualizerIcon />,
}, {
  text: 'Новый сбор',
  linkUrl: '/new-portion',
  icon: <AddTaskIcon />,
}];

const ContextWrapper = ({ children }) => {
  const { pathname } = useRouter();
  const [user, setUser] = useState(null);
  const [subTitle, setSubTitle] = useState(null);

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
    <Context.Provider value={{ user, login, logout, updateSubTitle }}>
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
  );
};

export default ContextWrapper;
