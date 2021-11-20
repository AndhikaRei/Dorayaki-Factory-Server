# Dorayaki-Factory-Server

NODE.JS

## Endpoints
### Auth
- POST /api/v1/auth/register
  - Register user
- POST /api/v1/auth/login
  - Login user
  
### Ingredients
- GET /api/v1/ingredients
  - Get all ingredients
- POST /api/v1/ingredients
  - Add new ingredients
- GET /api/v1/ingredients/:id
  - Get ingredient by id
- PATCH /api/v1/ingredients/:id
  - Update ingredient
  
### Requests
- GET /api/v1/requests
  - Get all requests
- POST /api/v1/requests
  - Add new requests
- GET /api/v1/requests/:id
  - Get request by id
- PATCH /api/v1/requests/:id
  - Update request
  
### Recipes
- GET /api/v1/recipes
  - Get all recipes
- GET /api/v1/recipes/names
  - Get all recipe names
- POST /api/v1/recipes
  - Add new recipes