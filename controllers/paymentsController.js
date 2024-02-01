const Razorpay = require("razorpay");
const COURT_SCHEDULES = require("../Models/courtShedules");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

const orders = async (req, res) => {
  // console.log("inside payment controller", req.body.slotId);
  const slotData = await COURT_SCHEDULES.findOne({ _id: req.body.slotId });

  if (slotData?.bookedBy) {
    res.status(400).json({ message: "slot already booked" });
  } else {
    try {
      const instance = new Razorpay({
        key_id: "rzp_test_YG9n5AzJN5tH9y",
        key_secret: "YHjzRcniOWRqtZXEep6euc8v",
      });

      const options = {
        amount: slotData?.cost * 100, // amount in smallest currency unit
        currency: "INR",
        receipt: slotData._id,
      };

      const order = await instance.orders.create(options);

      if (!order) return res.status(500).send("Some error occured");

      res.json(order);
    } catch (error) {
      res.status(500).send(error);
    }
  }
};
const paymentSuccess = async (req, res) => {
  try {
    // getting the details back from our font-end
    const {
      orderCreationId,
      razorpayPaymentId,
      razorpayOrderId,
      razorpaySignature,
      slotId,
    } = req.body;

    // Creating our own digest
    // The format should be like this:
    // digest = hmac_sha256(orderCreationId + "|" + razorpayPaymentId, secret);
    const shasum = crypto.createHmac("sha256", "YHjzRcniOWRqtZXEep6euc8v");

    shasum.update(`${orderCreationId}|${razorpayPaymentId}`);

    const digest = shasum.digest("hex");

    // comaparing our digest with the actual signature
    if (digest !== razorpaySignature)
      return res.status(400).json({ msg: "Transaction not legit!" });

    // THE PAYMENT IS LEGIT & VERIFIED
    // YOU CAN SAVE THE DETAILS IN YOUR DATABASE IF YOU WANT

    await COURT_SCHEDULES.updateOne(
      { _id: slotId },
      {
        $set: { bookedBy: req.userId },
        $push: {
          paymentOrders: {
            userId: req.userId,
            razorpayPaymentId,
            timeStamp: new Date(),
          },
        },
      }
    );
    initiateEmail(slotId,razorpayPaymentId)
    res.json({
      msg: "success",
      orderId: razorpayOrderId,
      paymentId: razorpayPaymentId,
    });
  } catch (error) {
    console.log('evide',error);
    res.status(500).send(error);
  }
};
const initiateEmail = async (id, razorpayPaymentId) => {
    
      const slotData = await COURT_SCHEDULES.findOne({ _id: id }).populate('bookedBy').populate('courtId');
      const { date, slot, cost, bookedBy, courtId } = slotData;
    
      const transporter = nodemailer.createTransport({
         service: 'gmail',
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
          user: "shaliea47@gmail.com",
          pass: "nzzg zfwo jbmp rjrb",
        },
      });
        const info = await transporter.sendMail({
        from: 'shaliea47@gmail.com',
        to: bookedBy.email,
        subject: "Booking Confirmation",
        text:'thanks for booking with us',
        html: `<b>Hello ${bookedBy.firstName} ,</b> <p>Your booking for ${new Date(date)} at ${slot.name} is confirmed. The total cost is ${cost}. Payment ID: ${razorpayPaymentId}</p>`,
      });
  
      console.log("Message sent: %s", info.messageId);
   
  };

module.exports = { orders, paymentSuccess };
