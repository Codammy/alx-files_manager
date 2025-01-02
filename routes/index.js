import express from 'express';
import { getStats, getStatus } from '../controllers/AppController';

const routes = express.Router();

routes.get('/status', getStatus);

routes.get('/stats', getStats);

export default routes;
