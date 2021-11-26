const router = require('express').Router();
const db = require('../models/db');
const auth = require('../middlewares/auth');
const nodemailer = require('nodemailer')
const {google} = require('googleapis')
const CLIENT_ID = '981968699053-gdp57lnld5oqa22p58j3f5mheinrdc27.apps.googleusercontent.com'
const CLIENT_SECRET = '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'
const REDIRECT_URI = 'https://developers.google.com/oauthplayground'
const REFRESH_TOKEN = '1//04l34o81WathVCgYIARAAGAQSNwF-L9Ir1ocegpQLI1sAr6sptVmMzPA7T0XFXtb08aUESmuHjBrn9yf0vjHJgJ-Wn8sOZge3uos'

const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI)
oAuth2Client.setCredentials({refresh_token: REFRESH_TOKEN })

async function sendMail(ip, dorayaki, amount){
  try{
    const accessToken = await oAuth2Client.getAccessToken()
    
    let emails = await db.users.findAll({attributes : ['email'], raw: true})

    emails = emails.map(email => email.email);

    const transport = nodemailer.createTransport({
      service:'gmail',
      auth:{
        type:'OAuth2',
        user: 'dorayummyfactory@gmail.com',
        clientId : CLIENT_ID,
        clientSecret : CLIENT_SECRET,
        refreshToken : REFRESH_TOKEN,
        accessToken : accessToken,
      }
    })
    const textMessage = `
    Hi Admin, DoraYummy Factory have a new stock addition request\n
    Request Detail\n
      IP Address: ${ip}\n
      Dorayaki: ${dorayaki}\n
      Amount: ${amount}\n
    `
    const htmlMessage = `
    <h1>Hi Admin, DoraYummy Factory have a new stock addition request</h1>
    <h3>Request Detail</h3>
    <ul>
      <li>IP Address: ${ip} </li>
      <li>Dorayaki: ${dorayaki} </li>
      <li>Amount: ${amount} </li>
    </ul>
    `
    const mailList = emails;
    const mailOptions = {
      from: 'DoraYummy Factory <dorayummyfactory@gmail.com>',
      to: mailList,
      subject : "NEW STOCK ADDITION REQUEST ADDED",
      text : textMessage,
      html : htmlMessage
    }

    const result = await transport.sendMail(mailOptions)
    return result;
  }catch(error){
    return error
  }
}


// GET
// Get all requests
router.route('/').get(auth, (req, res) => {
  db.requests.findAll()
    .then((requests) => {
      res.status(200).json(requests);
    })
    .catch(err => res.status(400).json({error: err}));
});

// Get request by id
router.route('/:id').get(auth, (req, res) => {
    db.requests.findByPk(req.params.id)
      .then((request) => {
        res.status(200).json(request);
      })
      .catch(err => res.status(400).json({error: err}));
});

// POST
// Create new requests
router.route('/').post(async (req, res) => {
  const name = req.body.name;
  const amount = req.body.amount;
  const ip = req.body.ip;

  const recipe = await db.recipes.findOne({ where: { name: name } });
  if (recipe === null) {
    res.status(400).json({error: "Dorayaki recipe not found"});
    return;
  }
  db.requests.create({ip: ip, dorayaki: name, count: amount})
    .then((request) => {
      sendMail(ip, name, amount).then((result)=> {
        console.log('Email sent...', result)
        res.status(200).json({id: request.id})
      }).catch(err => console.log(err));

    })
    .catch(err => res.status(400).json({error: err}));
  // TODO : When failed to create make sure not notify email and return
});

// PATCH
// Update existing request
router.route('/:id').patch(auth, async (req, res) => {

  db.requests.update(req.body, {
    where: {
      id: req.params.id
    }
  })
    .then(() => {res.json("Request updated")})
    .catch(err => res.status(400).json({error: err}));
});

// Custom route
// Decline a request
router.route('/:id/decline').post(auth, async (req, res) => {
  const request = await db.requests.findByPk(req.params.id, { 
    raw: true 
  });
  if (request.status != 'pending') {
    res.status(400).json({error: "Only pending stock can be declined"});
    return;
  }
  db.requests.update({status: "declined"}, {
    where: {
      id: req.params.id
    }
  })
  .then(() => {res.json("Request updated")})
  .catch(err => res.status(400).json({error: err}));
});

// Accept a request
router.route('/:id/accept').post(auth, async (req, res) => {
  const request = await db.requests.findByPk(req.params.id, { 
    raw: true 
  });
  if (request.status != 'pending') {
    res.status(400).json({error: "Only pending stock can be accepted"});
    return;
  }
  const recipe = await db.recipes.findOne({
    where: {
      name: request.dorayaki 
    },
    raw: true 
  });
  const indgredientNeeded = await db.recipeIngredients.findAll({
    where: {
      id: recipe.id,
    },
    raw : true,
  });
  const newIngredient = []
  for (const e of indgredientNeeded) {
    const ingredients = await db.ingredients.findByPk(e.ingredient,{
      raw: true
    });
    if (ingredients.stock < e.count * request.count) {
      res.status(400).json({error: "Stock is not enough"});
      return;
    }
    newIngredient.push({id: e.ingredient, stock: ingredients.stock - e.count * request.count});
  };
  for (const ingredient of newIngredient) {
    await db.ingredients.update({stock: ingredient.stock}, {
      where: {
        id: ingredient.id,
      }
    });
  };
  db.requests.update({status: "accepted"}, {
    where: {
      id: req.params.id
    }
  })
    .then(() => {res.json("Request updated")})
    .catch(err => res.status(400).json({error: err}));
});

module.exports = router;