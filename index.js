const express = require('express');

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());

const ingredientRouter = require('./routes/ingredient');

app.use('/api/ingredients', ingredientRouter);

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`)
});