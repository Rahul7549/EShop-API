const express=require('express');
const app=express();
require('dotenv/config');
const api=process.env.API_URL;
const bodyParser=require('body-parser');
const morgan=require('morgan');
const mongoose =require('mongoose');
const cors=require('cors');
const AuthJwt =require('./Services/Auth')
const errorhandler =require('./Services/errorhandler');


////middle ware
app.options('*',cors())
app.use(bodyParser.json());
app.use(morgan('tiny'));
app.use(AuthJwt());
app.use(errorhandler); 
console.log('Auth has been done');

//Router
const productRouters=require('./Routers/products');
const userRouters=require('./Routers/users')
const categoryRouters=require('./Routers/category');
const errorHandler = require('./Services/errorhandler');

// Calling the Api
app.use(`${api}/products`,productRouters);
app.use(`${api}/users`,userRouters);
app.use(`${api}/category`,categoryRouters);

///DataBase Coneection
mongoose.connect(process.env.CONNECTSTRING ,{
    useUnifiedTopology: true,
    useNewUrlParser: true,
    dbName:'EShop-DataBase'
})
.then(()=>{
    console.log('CONNECTED WITH MONGODB ATLAS');
})
.catch(()=>{
    console.log('Some error occur while connecting the mongodb');
})

app.listen(3000,()=>{
    console.log('server is runing on http://localhost:3000');
})
