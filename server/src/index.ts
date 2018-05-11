
import * as http from 'http';
import { logger } from './core/lib/AppLogger';
import { mongo } from './core/lib/AppMongoDriver';

const port = process.env.PORT || 3000

let start = async ()  => {
  let app;
  try {
    //Executing async boot operations
    await mongo.connect();

    //Loading App
    const App = require('./App');
    app = App.default;

    //Bootstrapping server
    http.createServer(app).listen(port, (err) => {
      if (err) {
        return logger.error(err);
      }
      return logger.info(`server is listening on ${port} ${process.env.NODE_ENV}`)
    })
  } catch (err) {
    logger.error(err);
  }

  return app;
}



export let server = start();