import mongoose from 'mongoose';

export default class BaseModel {
  public model: mongoose.Model<mongoose.Document> = null;
  constructor(connection: mongoose.Connection, name: string, schema: mongoose.Schema) {
    this.model = connection.model(name, schema);
  }
}
