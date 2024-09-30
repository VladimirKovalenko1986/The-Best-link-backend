import { model, Schema } from 'mongoose';
import { authEmailFormate } from '../../constants/index.js';
import { mongooseSaveError, setUpdateSettigs } from './hooks.js';

const userSchema = new Schema(
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

userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

userSchema.post('save', mongooseSaveError);
userSchema.pre('findOneAndUpdate', setUpdateSettigs);
userSchema.post('findOneAndUpdate', mongooseSaveError);

const User = model('users', userSchema);

export { User };
