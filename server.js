const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const fs = require('fs');
const path = require('path');
const createRegularJob = require('./utils/createRegularJob');

const dev = process.env.NODE_ENV !== 'production';

const hostname = 'localhost';
const port = process.env.PORT || 3000;

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(async () => {
  try {
    const alter = process.env.DB_ALTER === 'true';
    const db = require('./db/models');

    await db.sequelize.authenticate();

    await db.sequelize.sync({ alter });
    
    // createRegularJob(() => db.employees.update({
    //   isWorking: false,
    // }, {
    //   where: {
    //     isWorking: true,
    //   },
    // }), { hour: 15, minute: 0 });

  } catch (err) {
    console.log(err);
  }

  createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true);
      const { pathname, query } = parsedUrl;

      if (pathname === '/a') {
        await app.render(req, res, '/a', query);
      } else if (pathname === '/b') {
        await app.render(req, res, '/b', query);
      } else if (pathname.includes('savedFiles')) {
        const ext = pathname.split('.').pop();

        res.writeHead(200, { 'content-type': `image/${ext}` });

        const path_ = path.join(__dirname, `public${pathname}`);

        if (!fs.existsSync(path_)) {
          return res.end();
        }

        const stream = fs.createReadStream(path_);

        stream.on('open', () => stream.pipe(res));

        stream.on('error', err => {
          res.end(err);
        });
      } else {
        await handle(req, res, parsedUrl);
      }
    } catch (err) {
      console.error('Error occurred handling', req.url, err);
      res.statusCode = 500;
      res.end('internal server error');
    }
  }).listen(port, (err) => {
    if (err) {
      throw err;
    }
    console.log(`> Ready on http://${hostname}:${port}`);
  });
});
