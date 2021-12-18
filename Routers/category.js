const express=require('express')
const router=express.Router();
const {Category}=require('../models/category');

router.get('/',async(req,res)=>{
    const categoryList= await Category.find();
    if(!categoryList)
    {
        res.status(500).json({success:true})
    }
    res.send(categoryList);
})

router.get('/:id',async(req,res)=>{
    const category= await Category.findById(req.params.id);
    if(!category)
        res.status(500).json({success:true,message:'Ctegorynot found with this id'})
    res.status(200).send(category);
})

router.post('/', (req,res)=>{
    const category=new Category({
        name:req.body.name,
        icon:req.body.icon,
        color:req.body.color
    })

    category.save()
    .then((createdCategory)=>{
        res.status(200).json(createdCategory)
    })
    .catch((err)=>{
        res.status(500).json({
            error:err,
            success:false
        })
    })
   res.send(category);
})


router.put('/:id',async(req,res)=>{
    const category=await Category.findByIdAndUpdate(
        req.params.id,
        {
            name:req.body.name,
            icon:req.body.icon,
            coloe:req.body.coclo
        },
        {new:true}
    )
    if(!category)
    return res.status(400).send('categogry cant not be updated');

    res.status(200).send(category);
})



router.delete('/:id',(req,res)=>{
    Category.findByIdAndRemove(req.params.id).then((category)=>{
        if(category)
        {
            return res.status(200).json({success:true,message:'Category has been deleted!'});
        }
        else
        {
            return res.status(404).json({success:true,message:'Category not found!'})
        }
    })
    .catch((err)=>{
       return  res.status(400).json({success:false,error:err})
    })
})

module.exports=router;