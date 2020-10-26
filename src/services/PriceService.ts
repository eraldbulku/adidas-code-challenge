import fetch from 'node-fetch';
import bluebird from 'bluebird';
import config from '../config';

(fetch as any).Promise = bluebird;

class PriceService {
  public headers = {'Accept-Language': 'en-US'};
  public getPricePerProduct = async (productId: string) => {
    let productPrice = 'N/A';
    try {
      const response = await fetch(`${config.priceEngineBaseUrl}product/${productId}`, {headers: this.headers, method: 'GET'});
      const content = await response.json();
      productPrice = `${content.price} ${content.currency}`;
    } catch (error) {
      console.log(`Couldn't fetch price for product ${productId}`, error);
    }
    return productPrice;
  };
}

export default new PriceService();
