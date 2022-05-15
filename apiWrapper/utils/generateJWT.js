const jwt = require('jsonwebtoken');

const generateJWT = async payload => new Promise((res, rej) => {
  jwt.sign(
    payload,
    process.env.JWT_SECRET,
    { expiresIn: '5h' },
    (err, token) => {
      if (err) rej('Error while generating JWT');

      res(token);
    }
  );
});

export default generateJWT;
