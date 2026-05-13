const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// GET all
router.get('/', async (req,res)=>{
  const list = await Product.find({}).sort({createdAt:-1});
  res.json(list);
});

// GET one
router.get('/:id', async (req,res)=>{
  const p = await Product.findById(req.params.id);
  if(!p) return res.status(404).json({ error:'Not found' });
  res.json(p);
});

// CREATE (admin)
router.post('/', async (req,res)=>{
  const data = req.body;
  const p = new Product(data);
  await p.save();
  res.status(201).json(p);
});

// UPDATE
router.put('/:id', async (req,res)=>{
  const p = await Product.findByIdAndUpdate(req.params.id, req.body, { new:true });
  res.json(p);
});

// DELETE
router.delete('/:id', async (req,res)=>{
  await Product.findByIdAndDelete(req.params.id);
  res.json({ ok:true });
});

module.exports = router;