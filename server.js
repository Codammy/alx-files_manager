import express from 'express';
import appRoute from './routes/index';

const server = express();
server.use(appRoute);
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
