import mongoose from 'mongoose';
import BaseModel from './BaseModel';

const MODEL_NAME = 'Product';
const MODEL_SCHEMA = new mongoose.Schema({
  product_id: {
    type: mongoose.Schema.Types.String,
    unique: true,
    required: true
  },
  name: {
    type: mongoose.Schema.Types.String,
    default: null
  },
  inventoryAmount: {
    type: mongoose.Schema.Types.Number,
    required: true,
    default: 0
  },
  consumedAmount: {
    type: mongoose.Schema.Types.Number,
    required: true,
    default: 0
  }
});

export default class Product extends BaseModel {
  constructor(connection: mongoose.Connection) {
    super(connection, MODEL_NAME, MODEL_SCHEMA);
  }
}
