const express=require('express');
const router=express.Router();
const {Product} = require('../models/products');
const { Category } = require('../models/category');
const mongoose=require('mongoose')

router.get('/', async(req,res)=>{
    let filterBy={}
    if(req.query.category)
    {
        filterBy={ category:req.query.category.split(',') }
        console.log(filterBy);
    }
    const ProductsList = await Product.find(filterBy).select().populate('category')
    if(!ProductsList)
    {
        res.status(500).json({success:true})
    }
    res.send(ProductsList);
})

router.get('/:id', async(req,res)=>{
    const product = await Product.findById(req.params.id).populate('category')
    if(!product)
    {
        res.status(500).json({success:true})
    }
    res.send(product);
})

router.post(`/`, async (req, res) =>{
    const category = await Category.findById(req.body.category);
    if(!category) return res.status(400).send('Invalid Category')

    let product = new Product({
        name: req.body.name,
        description: req.body.description,
        richDescription: req.body.richDescription,
        image: req.body.image,
        brand: req.body.brand,
        price: req.body.price,
        category: req.body.category,
        countInStock: req.body.countInStock,
        rating: req.body.rating,
        numReviews: req.body.numReviews,
        isFeatured: req.body.isFeatured,
    })

    product = await product.save().then((product)=>{
        if(!product) 
            return res.status(404).send('The product cannot be created')
        else
            return res.status(200).send('the product created');
        
    })
    .catch((err)=>{
        res.status(500).json({
            success:false,
            error:err
        })
    })   
})


router.put(`/:id`, async (req, res) =>{
    if(mongoose.isValidObjectId(req.params.id))
    {
        return res.status(404).send('Invalid Product Id')
    }
    const category = await Category.findById(req.body.category);
    if(!category) return res.status(400).send('Invalid Category')

    const product = await Product.findByIdAndUpdate(
        req.params.id,
        {
            name: req.body.name,
        description: req.body.description,
        richDescription: req.body.richDescription,
        image: req.body.image,
        brand: req.body.brand,
        price: req.body.price,
        category: req.body.category,
        countInStock: req.body.countInStock,
        rating: req.body.rating,
        numReviews: req.body.numReviews,
        isFeatured: req.body.isFeatured,

        },
        {new:true}
    )

    if(!product)
        return res.status(500).json({
            success:false,
            error:err
        })
     res.send(product)
})

router.get('/get/count', async(req,res)=>{
    const productCount = await Product.find().countDocuments((count)=>count)
    if(!productCount)
    {
        res.status(500).json({success:false})
    }
    res.send({
        count:productCount
    });
})

router.get('/get/featured/:count', async(req,res)=>{
    const count= req.params.count ? req.params.count :0
    const featuredProduct = await Product.find( {isFeatured:true}).limit(+count)

    if(!featuredProduct)
    {
        res.status(500).json({success:false})
    }
    res.send({
        count:featuredProduct
    });
})

router.get('/', async(req,res)=>{
    
    const ProductsList = await Product.find(filterBy)
    if(!ProductsList)
    {
        res.status(500).json({success:true})
    }
    res.send(ProductsList);
    console.log(filterBy)
})



module.exports=router;