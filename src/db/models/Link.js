import { model, Schema } from 'mongoose';

const linkSchema = new Schema(
  {
    nameType: {
      type: String,
      required: true,
      enum: ['HTML&CSS', 'JS', 'React', 'TS', 'Node.js'],
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
  },

  {
    timestamps: true,
    versionKey: false,
  },
);

const Link = model('link', linkSchema);

export { Link };
