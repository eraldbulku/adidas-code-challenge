import mongoose from 'mongoose';
import config from '../config';
import Models from './models';
import ProductRepository from './repositories/ProductRepository';
import OrderRepository from './repositories/OrderRepository';

export default class Database {
  public static models: Models = null;
  public static productRepository: ProductRepository = null;
  public static orderRepository: OrderRepository = null;
  public static async initConnection() {
    const {host, database, port, options} = config.databaseConfig;
    const connection: mongoose.Connection = await new Promise(async (resolve) => {
      try {
        const connection = await mongoose.createConnection(`mongodb://${host}:${port}/${database}`, options);
        resolve(connection);
      } catch (error) {
        console.log('Failed connecting with MongoDB instance: ', error);
        resolve(null);
      }
    });
    return connection;
  }
  public static async init() {
    Database.connection = await new Promise(async (resolve) => {
      let connectionObject = null;
      while (!connectionObject) {
        connectionObject = await Database.initConnection();
      }
      resolve(connectionObject);
    });
    this.models = new Models(Database.connection);
    this.productRepository = new ProductRepository(this.models.productModel.model);
    this.orderRepository = new OrderRepository(this.models.orderModel.model);
    console.log('Connection with database established successfully!!!');
  }
  private static connection: mongoose.Connection = null;
}
