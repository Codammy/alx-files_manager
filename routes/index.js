import express from 'express';
import { getStats, getStatus } from '../controllers/AppController';
import postNew from '../controllers/UsersController';
import { getConnect, getDisConnect, getMe } from '../controllers/AuthController';
import postUpload, {
  getFile,
  getIndex, getShow, putPublish, putUnpublish,
} from '../controllers/FilesController';

const routes = express.Router();

routes.get('/status', getStatus);

routes.get('/stats', getStats);

routes.post('/users', postNew);

routes.get('/connect', getConnect);

routes.get('/disconnect', getDisConnect);

routes.get('/users/me', getMe);

routes.post('/files', postUpload);

routes.get('/files', getIndex);

routes.get('/files/:id', getShow);

routes.put('/files/:id/publish', putPublish);

routes.put('/files/:id/unpublish', putUnpublish);

routes.get('/files/:id/data', getFile);

export default routes;
