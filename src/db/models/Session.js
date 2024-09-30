import { model, Schema } from 'mongoose';
import { mongooseSaveError, setUpdateSettigs } from './hooks.js';

const sessionsSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'users', required: true },
    accessToken: { type: String, required: true },
    refreshToken: { type: String, required: true },
    accessTokenValidUntil: { type: Date, required: true },
    refreshTokenValidUntil: { type: Date, required: true },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

sessionsSchema.post('save', mongooseSaveError);
sessionsSchema.pre('findOneAndUpdate', setUpdateSettigs);
sessionsSchema.post('findOneAndUpdate', mongooseSaveError);

const Sessions = model('sessions', sessionsSchema);

export { Sessions };
