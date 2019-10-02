const User = require("../models/User");

module.exports = {
  async store(req, res) {
    const { email } = req.body;

    // Validate if user exists then create
    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({ email });
      return res.status(201).json(user);
    }
    return res.status(200).json(user);
  }
};
