const mongoose=require("mongoose");
const donationSchema=new mongoose.Schema({
    title:String,
    description:String,
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    category:String,
    location:{
        type:{type:String,default:"Point"},
        coordinates:[Number]
    },
    status:{
        type:String,
        enum:["Available","In Progress","Completed"],
        default:"Available"
    },
    createdAt:{
        type:Date,
        default:Date.now
    },
    image: { type: String },
     address: { type: String }

});
donationSchema.index({location:"2dsphere"});
module.exports=mongoose.model("Donation",donationSchema);