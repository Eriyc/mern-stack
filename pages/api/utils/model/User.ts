import mongoose, { Model, Mongoose } from "mongoose";
import Joi from "joi";
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    min: 4,
    max: 25,
  },
  email: {
    type: String,
    required: true,
    min: 5,
    max: 60,
  },
  password: {
    type: String,
    required: true,
    min: 6,
    max: 1024,
  },
});

let User: Model<any, {}>;

try {
  User = mongoose.model("User");
} catch (error) {
  User = mongoose.model("User", userSchema, "users");
}

const registerBodySchema = Joi.object({
  name: Joi.string().min(4).max(25).required(),
  email: Joi.string().min(5).max(255).required().email(),
  password: Joi.string().min(6).required(),
});

const loginBodySchema = Joi.object({
  email: Joi.string().min(5).max(255).required().email(),
  password: Joi.string().min(6).required(),
});

export { registerBodySchema, loginBodySchema };
export default User;
