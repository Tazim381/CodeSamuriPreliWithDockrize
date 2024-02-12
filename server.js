require("dotenv").config();

const express = require("express");
const app = express();
const PORT = 8000;
const connectDB = require("./config/db");
const Train = require("./models/Train");
const User = require("./models/User");
const Station = require("./models/Station");

app.listen(PORT, (req, res) => {
  console.log(`App is running on port ${PORT}`);
});

connectDB();

app.use(express.json());


app.post("/api/users", async (req, res) => {
  const userObj = req.body;
  const user = new User(userObj);
  await user.save();
  res.status(201).json(userObj);
});

app.post("/api/stations", async (req, res) => {
  const stationObj = req.body;
  const station = new Station(stationObj);
  await station.save();
  res.status(201).json(stationObj);
});

app.post("/api/trains", async (req, res) => {
  const trainObj = req.body;
  const train = new Train(trainObj);
  await train.save();
  const response = {
    train_id: trainObj?.train_id,
    train_name: trainObj?.train_name,
    capacity: trainObj?.capacity,
    service_start: trainObj?.stops[0]?.departure_time,
    service_ends: trainObj?.stops[trainObj?.stops.length - 1]?.arrival_time,
    num_stations: trainObj?.stops?.length,
  };
  res.status(201).json(response);
});

app.get("/api/stations", async (req, res) => {
  const station = await Station.find()
    .sort({ station_id: 1 })
    .select({ _id: 0, __v: 0 });
  const stations = {
    stations: station,
  };
  res.status(200).json(stations);
});

app.get("/api/stations/:station_id/trains", async (req, res) => {
  const stationId = parseInt(req.params.station_id);

  // Check if the station exists
  const stationExists = await Station.exists({ station_id: stationId });
  if (!stationExists) {
    return res
      .status(404)
      .json({ message: `Station with id: ${stationId} was not found ` });
  }

  try {
    const result = await Train.aggregate([
      {
        $match: {
          "stops.station_id": stationId,
        },
      },
      {
        $unwind: "$stops",
      },
      {
        $match: {
          "stops.station_id": stationId,
        },
      },
      {
        $project: {
          _id: 0,
          train_id: 1,
          arrival_time: "$stops.arrival_time",
          departure_time: "$stops.departure_time",
        },
      },
      {
        $sort: {
          departure_time: 1,
          arrival_time: 1,
          train_id: 1,
        },
      },
    ]);

    const response = {
      station_id: stationId,
      trains: result,
    };

    res.status(200).json(response);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.get("/api/wallets/:wallet_id", async (req, res) => {
  const wallet_id = parseInt(req.params.wallet_id);
  const user = await User.findOne({ user_id: wallet_id });
  if (!user) {
    return res
      .status(404)
      .json({ message: `wallet with id: ${wallet_id} was not found` });
  }
  const result = {
    wallet_id: wallet_id,
    balance: user.balance,
    wallet_user: {
      user_id: wallet_id,
      user_name: user.user_name,
    },
  };
  res.status(200).json(result);
});

app.put('/api/wallets/:wallet_id',async(req,res)=>{

    const userId = req.params.wallet_id
    const amount = req.body
    const user = await User.findOne({user_id:userId})
    if(!user) {
        return res
        .status(404)
        .json({ message: `wallet with id: ${userId} was not found` });
    }
    if(!(amount.recharge>=100 && amount.recharge<=10000)) {
        return res.status(400).json({message:`invalid amount: ${amount.recharge}`})
    }
    user.balance += amount.recharge
    user.save()
    const result = {
        wallet_id: userId,
        balance: user.balance,
        wallet_user: {
          user_id: userId,
          user_name: user.user_name,
        },
      };
      res.status(200).json(result);

}) 
