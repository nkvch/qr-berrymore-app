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
  const [contents, setContents] = useState([]);
  const [loading, setLoading] = useState(false);

  const login = (token, user) => {
    localStorage.setItem('jwt', token);
    setUser(() => user);
  };

  const logout = () => {
    localStorage.removeItem('jwt');
    setUser(() => null);
  };

  const onLoading = () => {
    console.log('on loading');
    setLoading(() => true);
  }

  const offLoading = () => {
    console.log('off loading');
    setLoading(() => false);
  }

  useEffect(() => {
    request({
      url: '/auth',
      callback: (status, response) => {
        if (status === 'ok') {
          
          const { token, ...userData } = response;

          login(token, userData);
        } else if (status === 'error') {
          logout();
        }
      }
    });
  }, []);

  return (
    <Context.Provider value={{ user, login, logout, loading, onLoading, offLoading }}>
      <Wrapper title="Berrymore" menuItems={
        user
        ? authMenuOptions
        : unauthMenuOptions
      }
        contents={contents}
      >
          {children}
      </Wrapper>
    </Context.Provider>
  );
};

export default ContextWrapper;
