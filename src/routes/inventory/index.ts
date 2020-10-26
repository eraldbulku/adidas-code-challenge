import express from 'express';
import Database from '../../database';
import BadFormatRequest from '../../errors/BadFormatRequest';
import {IProductRequest} from '../../../@types/productRequest';
import NotFoundError from '../../errors/NotFoundError';
import {parseDocFromModel} from '../../utils/helpers';
const inventoryRouter = express.Router();

// get all products with prices from the service
inventoryRouter.get('/', async (req: express.Request, res: express.Response) => {
  const pricedRecordsList = await Database.productRepository.getAllPricedProducts();
  (res as any).success('', pricedRecordsList);
});

// consume products or store in pending orders to wait for client confirmation
inventoryRouter.post('/', async (req: express.Request, res: express.Response) => {
  const payload = req.body;

  if (!Array.isArray(payload)) {
    return (res as any).error(new BadFormatRequest('Payload should be an array'));
  }
  if (!payload.length) {
    return (res as any).error(new BadFormatRequest('Payload should not be empty array'));
  }
  const isRequestValid = payload.every((requestRecord) => {
    return requestRecord.productId && typeof requestRecord.amount !== 'undefined' && !isNaN(requestRecord.amount);
  });
  if (!isRequestValid) {
    return (res as any).error(new BadFormatRequest('Payload record should follow interface: {productId: string, amount: number}'));
  }
  const parsedRequest = payload.map(record => ({productId: record.productId, amount: +record.amount} as IProductRequest))
  const unavaliableProducts = await Database.productRepository.getUnavailableProducts(parsedRequest);

  // Check if all requested items are unvailable and respond with error to the client
  if (unavaliableProducts.length === parsedRequest.length) {
    return (res as any).error(new BadFormatRequest('The requested products are not available'));
  }

  // Check if there is any requested item that it's not available so we can save order and notify client
  if (unavaliableProducts.length) {
    const pendingOrderRecord = await Database.orderRepository.createOrderRecord(parsedRequest);
    (res as any).success(
      'There are one or more unavailable products in this request. Do you want to proceed?',
      {id: (pendingOrderRecord as any)._id}
    );
  } else {
    // In case all items are available we will proceed with the orders
    const consumeResponse = await Database.productRepository.consumeProducts(parsedRequest);
    if (consumeResponse.every(record => !record)) {
      return (res as any).error(new Error(`Couldn't process any of the requests. Please try again.`));
    }
    (res as any).success(
      consumeResponse.some(record => !record)
      ? `One or more of the requests failed, please check again.`
      : `All products successfully ordered.`
    );
  }

});

// user confirms order that contains products which are out of stock
inventoryRouter.post('/confirm-order/:orderId', async (req: express.Request, res: express.Response) => {
  const orderId = req.params.orderId;
  if (!orderId) {
    return (res as any).error(new BadFormatRequest('Order ID parameter is missing from request'));
  }
  const pendingOrderRecord = await Database.orderRepository.getOrderRecordById(orderId);
  if (!pendingOrderRecord) {
    return (res as any).error(new NotFoundError(`Order with ID ${orderId} not found`));
  }
  const consumeResponse = await Database.productRepository.consumeProducts((pendingOrderRecord as any).orderRequest);
  if (consumeResponse.every(record => !record)) {
    return (res as any).error(new Error(`Couldn't process any of the requests. Please try again.`));
  }
  await Database.orderRepository.deleteOrderRecordById((pendingOrderRecord as any)._id);
  (res as any).success(
    consumeResponse.some(record => !record)
    ? `One or more of the requests failed, please check again.`
    : `All products successfully ordered.`
  );
});

// delete order in case client rejects
inventoryRouter.post('/reject-order/:orderId', async (req: express.Request, res: express.Response) => {
  const orderId = req.params.orderId;
  if (!orderId) {
    return (res as any).error(new BadFormatRequest('Order ID parameter is missing from request.'));
  }
  const pendingOrderRecord = await Database.orderRepository.getOrderRecordById(orderId);
  if (!pendingOrderRecord) {
    return (res as any).error(new NotFoundError(`Order with ID ${orderId} not found`));
  }
  const deleted = await Database.orderRepository.deleteOrderRecordById((pendingOrderRecord as any)._id);
  (res as any).success(deleted ? `Order rejected successfully.` : `Order was not rejected, please try again.`);
});

export default inventoryRouter;
