const { mongo } = require("../config/db");
const Schema = mongo.Schema;

const UserSchema = new Schema({
  username: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    require: true,
  },
  password: {
    type: String,
    require: true,
  },
  profilePic: String,
  createdAt: Date,
  updatedAt: Date,
});
const user = mongo.model("user", UserSchema, "Users");

module.exports = {
  Schema,
  mongo,
  user,
};
