import mongoose from 'mongoose';
import BaseModel from './BaseModel';

const MODEL_NAME = 'Order';
const MODEL_SCHEMA = new mongoose.Schema({
  orderRequest: {
    type: mongoose.Schema.Types.Array,
    required: true
  }
});

export default class Order extends BaseModel {
  constructor(connection: mongoose.Connection) {
    super(connection, MODEL_NAME, MODEL_SCHEMA);
  }
}
