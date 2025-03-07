const ex = require("express");
const endpoint = require("../config/endPoint");
const { user } = require("../models/user");
const router = ex.Router();
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;

router.get(endpoint.route.auth.login, async (req, res) => {
  const { email, password } = req.body;
  try {
    const userExits = await user.findOne({ email });
    if (userExits) {
      const isPasswordSame = await bcrypt.compare(password, userExits.password);
      if (!isPasswordSame) {
        res.send(400).json({ message: "password is Invaliad" });
      }
    } else {
      res.send(400).json({ message: "User don't exits try Registering" });
    }
  } catch (err) {
    res.send(500).json({ message: err?.message });
  }
});

function getToken(data) {
  const payload = {
    ...data,
  };
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });
}
