import express from 'express';
import { getStats, getStatus } from '../controllers/AppController';
import postNew from '../controllers/UserController';

const routes = express.Router();

routes.get('/status', getStatus);

routes.get('/stats', getStats);

routes.post('/users', postNew);

export default routes;
