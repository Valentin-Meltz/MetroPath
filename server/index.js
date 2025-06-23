import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import router from './routes/index.js';

dotenv.config();

const app = express();
app.use(cors());
app.use('/api', router);
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
}); 