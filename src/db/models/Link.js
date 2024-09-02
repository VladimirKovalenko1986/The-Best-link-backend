import { model, Schema } from 'mongoose';

const linksSchema = new Schema(
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

const linksCollection = model('links', linksSchema);

export { linksCollection };
