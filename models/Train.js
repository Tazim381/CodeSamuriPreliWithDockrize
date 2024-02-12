/*
{
 "train_id": integer, # train's numeric id
 "train_name": string, # train's name
 "capacity": integer, # seating capacity
 "stops": [ # list of stops
 {
 "station_id": integer, # station's id
 "arrival_time": string, # arrives at
 "departure_time" string, # leaves at
 "fare": integer # ticket cost
 },
 ...
 ]
}

*/

const mongoose = require('mongoose');

const trainSchema = new mongoose.Schema({
    train_id:{
        type: Number,
        required: true,
        unique: true
      },
    train_name : String,
    capacity: Number,
    stops:[{
        station_id : Number,
        arrival_time: String,
        departure_time: String,
        fare: String
    }]

})

const Train = mongoose.model('Train', trainSchema);
module.exports = Train;
