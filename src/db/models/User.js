import { model, Schema } from 'mongoose';
import { authEmailFormate } from '../../constants/index.js';

const usersSchema = new Schema(
  {
    name: { type: String, required: true },
    email: {
      type: String,
      match: [authEmailFormate, 'is invalid'],
      required: true,
      unique: true,
    },
    password: { type: String, required: true },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

usersSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

const User = model('user', usersSchema);

export { User };
