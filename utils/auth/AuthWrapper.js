import { useEffect, useState } from 'react';
import AuthContext from './authContext';
import Wrapper from '../../components/Wrapper';
import HomeIcon from '@mui/icons-material/Home';
import EqualizerIcon from '@mui/icons-material/Equalizer';
import PeopleIcon from '@mui/icons-material/People';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import ManageSearchIcon from '@mui/icons-material/ManageSearch';
import request from '../request';

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

const AuthWrapper = ({ children }) => {
  const [user, setUser] = useState(null);

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
      url: '/users/auth',
      callback: (status, response) => {
        if (status === 'OK') {
          const { token, ...userData } = response;

          login(token, userData);
        }
      }
    });
  }, []);

  return (
    <Wrapper title="Berrymore" menuItems={
      user
      ? authMenuOptions
      : unauthMenuOptions
    }>
      <AuthContext.Provider value={{ user, login, logout }}>
        {children}
      </AuthContext.Provider>
    </Wrapper>
  );
};

export default AuthWrapper;
