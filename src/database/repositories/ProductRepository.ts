import mongoose from 'mongoose';
import {IRepository} from "./IRepository";
import PriceService from '../../services/PriceService';
import {IProductRequest} from '../../../@types/productRequest';

export default class ProductRepository implements IRepository {
  constructor(public model: mongoose.Model<mongoose.Document>) { }

  public getAllPricedProducts = async () => {
    const records: Array<any> = await new Promise((resolve) => {
      this.model.find({}).lean()
        .then(resolve)
        .catch(error => {
          console.log(`Couldn't fetch all products records: `, error);
          resolve([]);
        });
    });
    return await records.reduce(async (updatedPricedRecordsPromise: Promise<Array<any>>, record) => {
      const updatedPricedRecords = await updatedPricedRecordsPromise;
      const price = await PriceService.getPricePerProduct(record.product_id);
      return Promise.resolve([...updatedPricedRecords, {...record, price}]);
    }, Promise.resolve([]));
  };

  public getProductByProductId = async (productId: string) => {
    return await new Promise((resolve) => {
      this.model.findOne({product_id: productId}, (error, doc) => {
        if (error) {
          console.log(`Couldn't find product with id: ${productId}`);
          resolve(null);
        }
        resolve(doc || null);
      });
    })
  };

  public getUnavailableProducts = async (request: Array<IProductRequest>) => {
    return await request.reduce(async (unavaliableProductsPromise: Promise<Array<IProductRequest>>, record: IProductRequest) => {
      const unavaliableProducts = await unavaliableProductsPromise;
      const dbProduct = await this.getProductByProductId(record.productId);
      if (
          !dbProduct ||
          (
            dbProduct &&
            dbProduct['_doc'] &&
            (dbProduct['_doc'].consumedAmount + record.amount > dbProduct['_doc'].inventoryAmount)
          )
        ) {
        unavaliableProducts.push(record);
      }
      return Promise.resolve(unavaliableProducts);
    }, Promise.resolve([]));
  };

  public consumeProducts = async (requestedProducts: Array<IProductRequest>): Promise<Array<boolean>> => {
    const unavaliableProducts = await this.getUnavailableProducts(requestedProducts);
    const availableProductsToConsume = requestedProducts.filter(
      (record: IProductRequest) =>
        unavaliableProducts.map((unavaliable: IProductRequest) => unavaliable.productId).indexOf(record.productId) === -1
    );
    return await availableProductsToConsume.reduce(async (updateResultsPromise: Promise<Array<boolean>>, record: IProductRequest) => {
      const updateResults = await updateResultsPromise;
      const recordModel: any = await this.getProductByProductId(record.productId);
      if (!recordModel) {
        return Promise.resolve([...updateResults, false]);
      }
      recordModel.consumedAmount = recordModel.consumedAmount + record.amount;
      let updated = true;
      try {
        await recordModel.save();
      } catch (error) {
        updated = false;
      }
      return Promise.resolve([...updateResults, updated]);
    }, Promise.resolve([]));
  }
}
