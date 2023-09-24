import * as ShopifyBuy from '@shopify/buy-button-js';

import { shopifyOptions } from './options'

let ui;

export const openCart = () => ui.openCart();

export const init = async ({ domain, token, productIds }) => {
  const client = await ShopifyBuy.buildClient({
    domain: domain,
    storefrontAccessToken: token,
  });

  ui = ShopifyBuy.UI.init(client);

  productIds.forEach(productId => {
    ui.createComponent('product', {
      id: productId,
      node: document.getElementById(`product-component-${productId}`),
      moneyFormat: '%24%7B%7Bamount%7D%7D',
      options: shopifyOptions,
    });
  });

  return ui;
};
