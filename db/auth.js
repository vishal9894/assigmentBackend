const  mongoose  = require("mongoose");

const Mongo_Url = process.env.MONGO_URL || "mongodb://localhost:27017/assessment"

const connectDB = async () =>{
    try{
        await mongoose.connect(Mongo_Url)
        console.log("db is connected");
        

    }catch(error){
        console.log(error);
        
    }
}

module.exports = connectDB;