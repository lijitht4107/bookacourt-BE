var express = require('express');
const { getAllcourtsData,getSinglecourtData,dayWiseTimeSlot,getMyBookingsData } = require('../controllers/userController');
const { userAuth } = require('../middlewares/authorization');

var router = express.Router();


router.get('/getAllcourtsData',userAuth,getAllcourtsData)
router.get('/getSinglecourtData',userAuth,getSinglecourtData)
router.get('/dayWiseTimeSlot',userAuth,dayWiseTimeSlot)
router.get('/getMyBookingsData',userAuth,getMyBookingsData)








module.exports = router;
 