import mongoose from 'mongoose';

export interface IRepository {
  model: mongoose.Model<mongoose.Document>;
}
