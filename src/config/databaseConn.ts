import mongoose from "mongoose";

export const ConnectToDb = async(db_uri:string)=>{
   try{
    const conn = await mongoose.connect(db_uri)
    return Promise.resolve(conn)
   }catch(error){
      return Promise.reject(`Error astablishaing connection with database ${error}`)
   }
}

