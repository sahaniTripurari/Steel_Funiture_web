const express = require('express');
const router = express.Router();
const Message = require('../models/Message');

router.post('/', async (req,res)=>{
  const m = new Message(req.body);
  await m.save();
  res.status(201).json(m);
});

router.get('/', async (req,res)=>{
  const list = await Message.find({}).sort({createdAt:-1});
  res.json(list);
});

module.exports = router;