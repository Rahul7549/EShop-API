const express=require('express');
const router=express.router();
const {Orders} =require('../models/orders');

router.get('/', async(req,res)=>{
    const OrderList=await Orders.find();
    if(!OrderList)
    {
        res.status(500).json({success:true})
    }
    res.send(OrderList);
})

module.exports=router;
