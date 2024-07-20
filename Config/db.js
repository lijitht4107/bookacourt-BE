const mongoose=require('mongoose')
const connectDb= async()=>{
      await mongoose.connect('mongodb+srv://lijiththazhathethil:r1gpJji93bRMmeQN@cluster0.mpf3kp0.mongodb.net/playGround')
}
connectDb().then(console.log('connected to db')).catch(err => console.log(err))

   //   try { 
   //      const connection=await mongoose.connect('mongodb+srv://lijiththazhathethil:qbsBSoOB8t3PEVUw@cluster0.gf4ke0g.mongodb.net/',{
   //          useNewUrlParser:'true'
   //      })
   //      console.log("Mongodb data base connected");
        
   //   } catch (err) {
   //      console.log( err,"not connected");
        
   //   }
// }
module.exports=connectDb 
