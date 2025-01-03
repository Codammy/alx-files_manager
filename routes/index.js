import express from 'express';
import { getStats, getStatus } from '../controllers/AppController';
import postNew from '../controllers/UsersController';

const routes = express.Router();

routes.get('/status', getStatus);

routes.get('/stats', getStats);

routes.post('/users', postNew);
routes.post('/connect', postNew);
routes.post('/disconnect', postNew);
routes.post('/users/me', postNew);

export default routes;
