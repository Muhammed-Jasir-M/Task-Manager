
import express, { json } from 'express';
import { connect } from 'mongoose';
import cors from 'cors';

require('dotenv').config();

import taskRoutes from './routes/taskRoutes';

const app = express();

connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));
  
app.use(cors());
app.use(json());

app.use('/tasks', taskRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


