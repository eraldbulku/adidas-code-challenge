import mongoose from 'mongoose';
import {IRepository} from './IRepository';
import {IProductRequest} from '../../../@types/productRequest';

export default class OrderRepository implements IRepository {
  constructor(public model: mongoose.Model<mongoose.Document>) { }
  
  public createOrderRecord = async (request: Array<IProductRequest>) => {
    return new Promise((resolve) => {
      this.model.create({orderRequest: request}, (error, instertedRecord) => {
        if (error) {
          console.log(`Failed creating pending order record with error: `, error);
          resolve(null);
        }
        resolve(instertedRecord);
      });
    });
  };

  public getOrderRecordById = (recordId: string) => {
    return new Promise((resolve) => {
      this.model.findOne({_id: recordId}, (error, doc: mongoose.Document) => {
        if (error) {
          console.log(`Failed getting pending order record with error: `, error);
          resolve(null);
        }
        resolve(doc);
      });
    });
  };

  public deleteOrderRecordById = (recordId: string): Promise<boolean> => {
    return new Promise((resolve) => {
      this.model.findOne({_id: recordId}, (error, doc: mongoose.Document) => {
        if (error) {
          console.log(`Failed getting pending order record for remove with error: `, error);
          resolve(false);
        }
        doc.remove((error) => {
          if (error) {
            console.log(`Failed removing pending order: `, error);
            resolve(false);
          }
          resolve(true);
        });
      });
    });
  }
}
