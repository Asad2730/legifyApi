import cors from "cors";
import express, { type Express } from "express";
import router from "../routes/main";
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from "../config/swagger";

const app: Express = express();

app.use(cors())
app.use(express.json())
app.use('/api-docs',swaggerUi.serve,swaggerUi.setup(swaggerSpec))
app.use('/api',router)
export default app ;