const Request=require("../models/Request");
exports.createRequest=async(req,res)=>{
    try{
        const{item,urgency,quantity,userId,coordinates,isNGO}=req.body;
        const request=await Request.create({
            item,
            urgency,
            quantity,
            userId,
            isNGO,
            location:{
                type:"Point",
                coordinates
            }
        });
        res.status(201).json(request);
       
        
    }
    catch(err){
        res.status(500).json({error:err.message});
    }
};
exports.getRequests=async(req,res)=>{
    try{
        const requests=await Request.find();
        res.status(200).json(requests);
    }
    catch(err){
        res.status(500).json({error:err.message});
    }
};