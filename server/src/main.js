import dotenv from "dotenv";
import connectDB from "./database/db.js";
import { app } from "./app.js";

dotenv.config(
    {
        path: "./.env"
    }
);


connectDB()
    .then( () => {
        let port = process.env.PORT || 4000;
        app.listen( port, () => {
            console.log("\nServer is running on port: ", port);
        } );
    } ).catch( (err) => {
        console.error("MongoDB connection failed !!!", err);
    } );
    