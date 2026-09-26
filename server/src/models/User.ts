import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  githubId: string;
  username: string;
  profileUrl: string;
  avatarUrl: string;
  targetRole?: string;
  selfRatedSkills?: string[];
  resumeText?: string;
  demonstratedSkills?: any;
  marketDemand?: any;
  jobFitScore?: number;
  microProjects?: any[];
}

const UserSchema: Schema = new Schema({
  githubId: { type: String, required: true, unique: true },
  username: { type: String, required: true },
  profileUrl: { type: String, required: true },
  avatarUrl: { type: String, required: true },
  targetRole: { type: String },
  selfRatedSkills: { type: [String] },
  resumeText: { type: String },
  demonstratedSkills: { type: Schema.Types.Mixed },
  marketDemand: { type: Schema.Types.Mixed },
  jobFitScore: { type: Number },
  microProjects: { type: [Schema.Types.Mixed], default: [] }
}, { timestamps: true });

export default mongoose.model<IUser>('User', UserSchema);
