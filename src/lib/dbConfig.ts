import mongoose from "mongoose";

type connectionObject = {
    isConnected?: number
}

const connection: connectionObject= {}

export default async function dbConnect(): Promise<void>  {
    if (connection.isConnected) {
        console.log("Dbconnection is already connected");
        return
    }
    try {
        const DB = await mongoose.connect(process.env.MONGODB_URL|| "", {})
        connection.isConnected =DB.connections[0].readyState    //connection destrac
        console.log(DB);
        
    } catch (error) {
        console.log("DB Connection Failed");
        
        process.exit(1)
    }
}
