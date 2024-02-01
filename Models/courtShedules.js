const mongoose=require('mongoose')

const courtSheduleSchema = mongoose.Schema({
    date:{
        type:Date,
        required:true,
        },
        slot:{
            type:Object,
            required:true,
        },
        cost:{
            type:Number,
            required:true,
        },
        bookedBy:{
            type:mongoose.Types.ObjectId,
            ref:'users'
        },
        cancellation:{
            type:Array, //[{userId,payment}]
        },
        courtId:{
            type:mongoose.Types.ObjectId,
            ref:'courts'
        },
        paymentOrders:{
            type:Array
        }
    
})

const courtShedule=mongoose.model('courtShedules',courtSheduleSchema)
module.exports=courtShedule