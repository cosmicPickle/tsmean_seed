import app from './App'
import * as http from 'http';
import { logger } from './core/lib/AppLogger';
import { mongo } from './core/lib/AppMongoDriver';

const port = process.env.PORT || 3000

let start = async ()  => {
  try {
    //Bootstrapping server
    
    await mongo.connect();
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