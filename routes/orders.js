const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

router.post('/', async (req,res)=>{
  const o = new Order(req.body);
  await o.save();
  res.status(201).json(o);
});

router.get('/', async (req,res)=>{
  const list = await Order.find({}).sort({createdAt:-1});
  res.json(list);
});

module.exports = router;