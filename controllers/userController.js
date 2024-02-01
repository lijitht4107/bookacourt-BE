const COURTS = require("../Models/courtSchema");
const COURT_SHEDULES = require("../Models/courtShedules");
const ObjectId = require("mongoose").Types.ObjectId;

const getAllcourtsData = (req, res) => {
  COURTS.find()
    .then((response) => {
      res.status(200).json(response);
    })
    .catch((err) => {
      res.status(500).json(err);
    });
};
const getSinglecourtData = async (req, res) => {
  try {
    const result = await COURTS.findOne({ _id: req.query.courtId });
    res.status(200).json(result);
  } catch (error) {
    console.log(error);
  }
};
const dayWiseTimeSlot = (req, res) => {
  let presentHour = new Date(req.query.Date).getHours();
  let presentDate = new Date(new Date(req.query.Date).setUTCHours(0, 0, 0, 0));
  COURT_SHEDULES.aggregate([
    {
      $match: {
        courtId: new ObjectId(req.query.courtId),
        date: presentDate,

        "slot.id": { $gt: presentHour + 1 },
      },
    },
    {
      $lookup: {
        from: "courts",
        localField: "courtId",
        foreignField: "_id",
        as: "court",
      },
    },
    {
      $project: {
        court: { $arrayElemAt: ["$court", 0] },
        _id: 1,
        date: 1,
        slot: 1,
        cost: 1,
        bookedBy: 1,
      },
    },
  ])
    .then((response) => {
      // console.log(response);
      res.status(200).json(response);
    })
    .catch((err) => {
      console.log(err);
    });
};

const getMyBookingsData = (req, res) => {
  const courrentDate = new Date();
  const slotHour = courrentDate.getHours();
  courrentDate.setUTCHours(0, 0, 0, 0);

  COURT_SHEDULES.aggregate([
    {
      $match: {
        bookedBy: new ObjectId(req.userId),
        $expr: {
          $or: [
            { $gt: ["$date", courrentDate] },
            {
              $and: [
                { $eq: ["$date", courrentDate] },
                { $gte: ["slot.id", slotHour] },
              ],
            },
          ],
        },
      },
    },
    {
      $lookup: {
        from: 'courts',
        localField: 'courtId',
        foreignField: '_id',
        as: 'courts',
      },
    },
    {
      $project: {
        _id: 1,
        date: 1,
        slot: 1,
        courtData: { $arrayElemAt: ['$courts', 0] },
      },
    },
  ]).then((response)=>{
    // console.log(response);
    res.status(200).json(response)
  }).catch((err)=>{
    console.log(err,"user bookings show area")
  })
};

module.exports = {
  getAllcourtsData,
  getSinglecourtData,
  dayWiseTimeSlot,
  getMyBookingsData,
};
