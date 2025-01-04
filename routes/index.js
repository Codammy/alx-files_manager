import express from 'express';
import { getStats, getStatus } from '../controllers/AppController';
import postNew from '../controllers/UsersController';
import { getConnect, getDisConnect, getMe } from '../controllers/AuthController';

const routes = express.Router();

routes.get('/status', getStatus);

routes.get('/stats', getStats);

routes.post('/users', postNew);

routes.get('/connect', getConnect);

routes.get('/disconnect', getDisConnect);

routes.get('/users/me', getMe);

export default routes;
