import app from './App'
import * as http from 'http';
const port = process.env.PORT || 3000

http.createServer(app).listen(port, (err) => {

  if (err) {
    return console.log(err);
  }

  return console.log(`server is listening on ${port}`)
})

export let server = app;