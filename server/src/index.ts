import app from './App'
import * as http from 'http';
import { logger } from './core/lib/AppLogger';
import { appMongooseModelManager } from './core/lib/AppMongooseModelManager';
const port = process.env.PORT || 3000

let start = async ()  => {
  try {
    //Bootstrapping server
    await appMongooseModelManager.waitIndexesCreated();
    
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