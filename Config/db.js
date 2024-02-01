const mongoose=require('mongoose')
const connectDb= async()=>{

     try { 
        const connection=await mongoose.connect('mongodb+srv://lijiththazhathethil:qbsBSoOB8t3PEVUw@cluster0.gf4ke0g.mongodb.net/',{
            useNewUrlParser:'true'
        })
        console.log("Mongodb data base connected");
        
     } catch (err) {
        console.log( err,"not connected");
        
     }
}
module.exports=connectDb 
