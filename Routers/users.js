const express=require('express');
const { model } = require('mongoose');
const router=express.Router();
const {Users} =require('../models/users');
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken')

router.get('/', async(req,res)=>{
    const usersList=await Users.find();
    if(!usersList)
    {
        res.status(500).json({
            success:true
        })
    }
    res.status(200).send(usersList);
})

router.get('/:id', async(req,res)=>{
    const user = await Users.findById(req.params.id).select('-passwordHash');

    if(!user) {
        res.status(500).json({message: 'The user with the given ID was not found.'})
    } 
    res.status(200).send(user);
})

router.post('/', async(req,res)=>{
    const newUser=new Users({
        name:req.body.name,
        email:req.body.email,
        passwordHash:bcrypt.hashSync(req.body.passwordHash),
        phone:req.body.phone,
        isAdmin:req.body.isAdmin,
        street:req.body.street,
        apartment:req.body.apartment,
        city:req.body.city,
        zip:req.body.zip,
        country:req.body.country
    })
    newUser.save().then((serverRes)=>{
        res.status(200).send({success:true})
       return  res.send(newUser);
    })
    .catch((err)=>{
            return res.status(400).send('the user cannot be created!')
    })

})

router.post('/login',async (req,res)=>{
    const user =await Users.findOne({email:req.body.email})
    const secret = process.env.secret;

    
    if(!user)
    {
        return res.status(400).send('no User found')
    }
    if(user && bcrypt.compareSync(req.body.passwordHash,user.passwordHash))
    {
        const token=jwt.sign({
            userId: user.id,
            isAdmin: user.isAdmin
        },
        secret,
        {expiresIn:'1d'})

        console.log(req.body.passwordHash,token);
        return res.status(200).send({user: user.email , token: token}) 
    }
    else{
        return res.status(400).send('Password is wrong');
    }
})


router.post('/register', async (req,res)=>{
    let user = new User({
        name: req.body.name,
        email: req.body.email,
        passwordHash: bcrypt.hashSync(req.body.password, 10),
        phone: req.body.phone,
        isAdmin: req.body.isAdmin,
        street: req.body.street,
        apartment: req.body.apartment,
        zip: req.body.zip,
        city: req.body.city,
        country: req.body.country,
    })
    user = await user.save();

    if(!user)
    return res.status(400).send('the user cannot be created!')

    res.send(user);
})


router.get('/get/count', async(req,res)=>{
    const userCount = await Users.find().countDocuments((count)=>count)
    if(!userCount)
    {
        res.status(500).json({success:false})
    }
    res.send({
        count:userCount
    });
})


router.delete('/:id', (req, res)=>{
    Users.findByIdAndRemove(req.params.id).then(Users =>{
        if(Users) {
            return res.status(200).json({success: true, message: 'the user is deleted!'})
        } else {
            return res.status(404).json({success: false , message: "user not found!"})
        }
    }).catch(err=>{
       return res.status(500).json({success: false, error: err}) 
    })
})


module.exports=router;