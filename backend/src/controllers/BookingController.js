const Booking = require("../models/Booking");

module.exports = {
  async store(req, res) {
    const { user_id } = req.headers;
    const { spot_id } = req.params;
    const { date } = req.body;

    const booking = await Booking.create({
      date,
      user: user_id,
      spot: spot_id
    });

    await booking
      .populate("spot")
      .populate("user")
      .execPopulate();

    const ownerSocket = req.connectedUsers[booking.spot.user];

    if (ownerSocket) {
      req.io.to(ownerSocket).emit("booking_request", booking);
    }

    res.status(201).json(booking);
  }
};
