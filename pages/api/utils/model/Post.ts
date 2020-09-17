import Joi from 'joi';
import mongoose, { Model, Schema } from 'mongoose';

const postSchema = new Schema({
  author: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
    min: 8,
    max: 50,
  },
  description: {
    type: String,
    min: 30,
    required: true,
  },
  likeCount: {
    type: Number,
    default: 0,
  },
  likes: {
    type: [String],
    default: [],
  },
  timestamp: {
    type: Date,
    required: true,
  },
});

let PostModel: Model<any, {}>;

try {
  PostModel = mongoose.model('Post');
} catch (error) {
  PostModel = mongoose.model('Post', postSchema, 'posts');
}

const postGetSchema = Joi.object({
  amount: Joi.number().required().min(1),
  seen: Joi.array().items(Joi.string()).default([]),
});

const postAddSchema = Joi.object({
  title: Joi.string().required().min(8).max(50),
  description: Joi.string().required().min(30),
});

export { postAddSchema, postGetSchema };
export default PostModel;
