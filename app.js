const express= require('express');
const app= express();
const morgan = require('morgan');
const mongoose=(require('mongoose'));
const cors =require('cors');

require('dotenv/config'); //a zero-dependency module that loads environment variables
app.use(cors());
app.options('*', cors()); // allowing all other http requests to be passed from all other origin
const authJwt=require('./helpers/jwt');
const errorHandler= require('./helpers/error-handler');
const api=process.env.API_URL;//fetching from the environment variable

//Middleware
app.use(express.json()); //to parse the body we need a middleware...that has control of the request and response
//make data be understandable by express coming from front end 
//earlier it was body-parser
app.use(morgan('tiny')); // to display log request in specific format
app.use(authJwt());
app.use(errorHandler);
app.use('/public/uploads',express.static(__dirname + '/public/uploads'))

const productsRoutes= require('./routes/products');
const categoriesRoutes= require('./routes/categories');
const ordersRoutes= require('./routes/orders');
const usersRoutes= require('./routes/users');




//Routers 
app.use(`${api}/products`,productsRoutes);
app.use(`${api}/categories`,categoriesRoutes);
app.use(`${api}/orders`,ordersRoutes);
app.use(`${api}/users`,usersRoutes);




mongoose.connect(process.env.CONNECTION_STRING)// mongodb connection
.then(() => {
    console.log("Db connection ready")
})
.catch((err) => {
    console.log(err);
})





app.listen(3000, ()=>{
    console.log('Server is running on http://localhost:3000');
}) //listen on port 3000 if sucessful callbacak function used