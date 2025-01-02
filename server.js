import express from 'express';
import appRoute from './routes/index';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(appRoute);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
