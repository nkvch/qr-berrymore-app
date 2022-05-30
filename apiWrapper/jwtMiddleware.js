import getUserIdByJwt from './utils/getUserIdByJwt';
import authWhiteList from './authWhiteList';

const jwtMiddleware = async (req, res) => {
  const { url, method } = req;

  const [path] = url.split('?');

  const authRequired = !authWhiteList.find(item => item.url === path && item.method === method);

  if (authRequired) {
    await getUserIdByJwt(req);
  }
};

export default jwtMiddleware;
