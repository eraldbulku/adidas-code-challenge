require('dotenv').config();
import Database from '../../Database';

const BATCH_PRODUCTS = [
  {
    product_id: '54',
    name: 'Product X',
    inventoryAmount: 25,
    consumedAmount: 10
  },
  {
    product_id: '75',
    name: 'Product Y',
    inventoryAmount: 30,
    consumedAmount: 30
  },
  {
    product_id: '42',
    name: 'Product Z',
    inventoryAmount: 40,
    consumedAmount: 35
  },
  {
    product_id: '152',
    name: 'Product XYZ',
    inventoryAmount: 15,
    consumedAmount: 7
  }
];

(async () => {
  await Database.init();
  const productModel = Database.models.productModel;
  try {
    await productModel.model.remove({});
    await productModel.model.insertMany(BATCH_PRODUCTS);
    console.log('Products successfully added');
  } catch (errors) {
    console.log('Failed batch insertion for products seeds', errors);
  }
  process.exit();
})();
