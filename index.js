const express = require('express');

var cors = require('cors')
const app = express();
const port = process.env.PORT || 5000;

app.use(cors())
app.use(express.json());

const authRouter = require('./routes/auth');
const ingredientRouter = require('./routes/ingredient');
const requestRouter = require('./routes/request');
const recipesRouter = require('./routes/recipe');

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/ingredients', ingredientRouter);
app.use('/api/v1/requests', requestRouter);
app.use('/api/v1/recipes', recipesRouter);

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`)
});