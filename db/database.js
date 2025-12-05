import mongoose from 'mongoose'

function connect(){
    mongoose.connect("mongodb://127.0.0.1:27017/chatApp")
.then(()=>console.log("Database connected"))
.catch((err)=>console.log("Database not connected"))
}

export default connect
// mongodb+srv://gharshadpanse123_db_user:v4w8p24EysVcFn4J@cluster0.xjyhorj.mongodb.net/