import { handleErrors } from './utils/handleErrors';
import NextCors from 'nextjs-cors';
import response from './utils/response';
import jwtMiddleware from './jwtMiddleware';

const apiWrapper = routeHandler => async (req, res) => {
  await NextCors(req, res, {
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
    origin: '*',
    optionsSuccessStatus: 200,
 });

  const method = req.method.toLowerCase();

  if (!routeHandler[method]) {
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
    
  try {
      await jwtMiddleware(req, res);

      response(await routeHandler[method](req), res);
  } catch (err) {
      handleErrors(err, res);
  };
};

export default apiWrapper;