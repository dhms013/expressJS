const express = require('express');
const app = express();

app.use(express.json());

// Import the routers
const postRouter = require('./Routes/POST');
const putRouter = require('./Routes/put');
const getRouter = require('./Routes/get');
const deleteRouter = require('./Routes/delete');

// Mount the routers on the '/users' path
app.use('/users', postRouter);
app.use('/users', putRouter);
app.use('/users', getRouter);
app.use('/users', deleteRouter);

// ... rest of your existing code
const port = 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});