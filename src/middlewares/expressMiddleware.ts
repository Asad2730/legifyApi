import cors from "cors";
import express, { type Express } from "express";
import router from "../routes/main";

const app: Express = express();

app.use(cors())
app.use(express.json())
app.use('/api',router)


export default app ;