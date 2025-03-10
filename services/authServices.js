const { user } = require("../models/user");
const JWT_SECRET = process.env.JWT_SECRET;
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const saltLevel = 10;

const registerUserServices = async (userData) => {
  const userExits = await user.findOne({ email: userData?.email }).exec();
  if (userExits) {
    return false;
  } else {
    const hashPassword = await bcrypt.hash(userData?.password, saltLevel);
    const createdAt = getCreatedAt();
    const saveUser = await user.create({
      ...userData,
      password: hashPassword,
      createdAt,
      updatedAt: createdAt,
    });
    const credential = {
      email: saveUser?.email,
      password: saveUser?.password,
    };
    const token = generateToken(credential);
    return {
      data: saveUser,
      token,
    };
  }
};

const loginUserService = async (userData) => {
  const userExits = await user.findOne({ email: userData?.email });
  if (userExits) {
    const isPasswordSame = await bcrypt.compare(
      userData?.password,
      userExits.password
    );
    if (!isPasswordSame) {
      return false;
    } else {
      const credential = {
        email: userData?.email,
        password: userData?.password,
      };
      const token = generateToken(credential);
      return {
        detail: { ...userExits._doc },
        token,
      };
    }
  } else {
    return "string";
  }
};

function generateToken(data) {
  const payload = {
    ...data,
  };
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });
  return token;
}

function getCreatedAt() {
  const date = new Date();
  return date;
}

module.exports = { registerUserServices, loginUserService };
