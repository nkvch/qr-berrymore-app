import getUserIdByJwt from "./utils/getUserIdByJwt";

const jwtMiddleware = async (req, res) => {
  const { url, method } = req;

  const isLoggingIn = url === '/api/auth' && method === 'POST';

  if (!isLoggingIn) {
    await getUserIdByJwt(req);
  }
};

export default jwtMiddleware;
