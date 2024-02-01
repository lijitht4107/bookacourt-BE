const COURT = require("../Models/courtSchema");
const COURT_SCHEDULES = require("../Models/courtShedules");

const addCourtData = async (req, res) => {
  try {
    await COURT({
      courtName: req.query.courtName,
      location: req.query.location,
      address: req.query.address,
      type: req.query.type,
      about: req.query.about,
      description: req.query.description,
      courtPic: req.file.filename,
    }).save();
    res.status(200).json({ message: "Court data added successfully" });
  } catch (error) {
    res.status(500).json({ message: "Invalid entry" });
  }
};
const addTimeSlotData = (req, res) => {
  const { startDate, endDate, cost, selectedTimings, id, courtId } = req.body;
  let currentDate = new Date(startDate);
  const lastDate = new Date(endDate);
  const slotObjects = [];

  while (currentDate <= lastDate) {
    for (data of selectedTimings) {
      slotObjects.push({
        date: JSON.parse(JSON.stringify(currentDate)),
        slot: { name: data.name, id: data.id },
        cost,
        courtId,
      });
    }
    currentDate.setDate(currentDate.getDate() + 1);
  }
  // console.log(slotObjects);
  COURT_SCHEDULES.insertMany(slotObjects).then((resp) => {
    res.status(200).json({ message: "court time slot create successfully" });
  });
};

const updateEditedCD = (req,res)=> {
// console.log(req.body);
COURT.updateOne({_id:req.body._id},{$set:{courtName:req.body.courtName,location:req.body.location,address:req.body.address,type:req.body.type,description:req.body.description,about:req.body.about}}).then(response=>{
  res.status(200).json({response})
})
}

module.exports = { addCourtData, addTimeSlotData,updateEditedCD  };
