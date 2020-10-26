import mongoose from 'mongoose';
import Product from './Product';
import Order from './Order';

export default class Models {
  public productModel: Product = null;
  public orderModel: Order = null;

  constructor(connection: mongoose.Connection) {
    this.productModel = new Product(connection);
    this.orderModel = new Order(connection);
  }
}
