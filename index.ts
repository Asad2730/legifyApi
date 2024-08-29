import dotenv from 'dotenv'; 
import app from './src/middlewares/expressMiddleware';
import { ConnectToDb } from './src/config/databaseConn';

dotenv.config();

const db_uri: string = process.env.MONGO_DB_URL || '';  
const port: number = parseInt(process.env.PORT || '3000', 10);  

if (!db_uri) {
  throw new Error('MONGO_DB_URL is not defined in the .env file');
}

(async()=>{
   try{
     await ConnectToDb(db_uri)
     app.listen(port,()=>console.log(`Server Running on Port:${port}`))
   }catch(err){
      console.error(err)
      process.exit(1)  
   }
})();
