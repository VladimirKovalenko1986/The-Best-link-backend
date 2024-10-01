import { model, Schema } from 'mongoose';
import { nameType } from '../../constants/index.js';
import { mongooseSaveError, setUpdateSettigs } from './hooks.js';

const linkSchema = new Schema(
  {
    nameType: {
      type: String,
      required: true,
      enum: nameType,
    },

    link: {
      type: String,
      required: true,
    },

    nameLink: {
      type: String,
      required: true,
    },

    textLink: {
      type: String,
      required: true,
    },

    userId: {
      type: Schema.Types.ObjectId,
      ref: 'users',
      required: true,
    },
  },

  {
    timestamps: true,
    versionKey: false,
  },
);

linkSchema.post('save', mongooseSaveError);
linkSchema.pre('findOneAndUpdate', setUpdateSettigs);
linkSchema.post('findOneAndUpdate', mongooseSaveError);

const Link = model('link', linkSchema);

export { Link };
