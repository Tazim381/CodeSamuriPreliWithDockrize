const mongoose=require("mongoose");
const stationSchema=new mongoose.Schema({
    station_id:{
        type:Number,
    },
    station_name:{
        type:String,
    },
    longitude:{
        type:Number,
    },
    latitude:{
        type:Number,
    }
})
module.exports=mongoose.model("station",stationSchema);