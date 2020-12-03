This is a simple rest api for woocommerce for mobile apps.

Wocommerce rest api is designed for store owner not for cliends. So if you want to integrate your mobile or web app with woocommerce you need to share your woocommerce secret api key with your client which is not secure.

In this example, we simply take requests, get response from woocommerce and forward it to out client. During this process we restrict certain requests with user based authentication by JWT tokens.

Ideal alternatives:

- You can write your own plugin on wordpress and manage user authentication in there.(You need to deal with php)
- or
- You can store all woocommerce data and sync with woocommerce by using woocommerce webhooks. This way you dont need to make call to woocommerce each time.

## Before using

- Please make sure that you have:
- Node.js installed (https://nodejs.org/)
- Create .env file in root directory and replace following keys with yours

```
SQUARE_ACCESS_TOKEN=your_square_access_token
WOO_CONSUMER_KEY=your_woo_consumer_key
WOO_CONSUMER_SECRET=your_woo_consumer_secret
WOO_BASE_PATH=your_woocommerce_url
JWT_SECRET=your_jwt_secret
```

- Run `npm install` or `yarn` in your root project folder

## Usage

To run the project, please use a command line the following:

- `npm start` or `nodemon index.js`
  - It will run the server at port 3600.
