import express, { Application } from 'express';
import swaggerUi from 'swagger-ui-express';
import cors from 'cors';
import { UserRoutes } from './modules/user/user.route';
import * as swaggerDocument from './swagger.json';
const app: Application = express();

// parser
app.use(express.json());
app.use(cors());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use('/api/users', UserRoutes);

export default app;
