# Adidas Coding Challenge

## Server Technology

* NodeJS
* Express
* Typescript

## Server Setup

1. Run 'npm install' (install all project dependencies)
2. Run MongoDB daemon service
2. Create .env file from .env.template with your local configurations
4. Run 'npm start' (start server)
5. Run 'npm run seed:products' to fill table with records


## Directory structure (src)

      database/           contains models, repositories and seeds
      errors/             contains errors handling
      middlewares/        contains middleware to extend response object with 'success and error' handlers
      routes/             contains routes and business logic
      service/            contains third-party service
      utils/              contains helpers

## Endpoints

- GET /inventory <br>
Get all products with prices from third-party service

- POST /inventory <br>
Consume the inventory if the request contains all products that are in stock. If not the order will be stored in another table and wait for client confirmation to consume the products that are in stock. <br>The request will be in body and content type will be application/json. Example:<br>
``productId`` - product_id you get from GET /inventory<br>
``amount`` - number of items you want to order for this product
 ```
 [{"productId": "54", "amount" : 2}, {"productId": "75", "amount" : 1}]. 
 ```
 
- POST /confirm-order/:orderId <br>
Confirm the order for the products that are in stock even if this order contains products that are out of stock. <br>
 ``orderId`` - id of order stored in 'orders' table
 
- POST /reject-order/:orderId <br>
Reject/delete the order if it contains products that are out of stock. <br>
``orderId`` - id of order stored in 'orders' table
 