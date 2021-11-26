const {Order}=require('../models/order');
const {OrderItem}=require('../models/order-item');
const express = require('express');
const router = express.Router();

router.get(`/`, async (req,res) =>{
    //2 prameters the route itself //and a callback with response which is sent to client when he calls this route
    const orderList= await Order.find().populate('user','name').sort({'dateOrdered': -1}); //await to get the list populated....async in=s needed now

    if(!orderList){
        res.status(500).json({success:false});
    }
    res.send(orderList);//sending to front end
});


router.get(`/:id`, async (req,res) =>{
   const order= await Order.findById(req.params.id)
   .populate('user','name')
   .populate({
       path: 'orderItems', populate: {
           path: 'product', populate: 'category'}
        });

    if(!order){
        res.status(500).json({success:false});
    }
    res.send(order);
});

router.post('/',async (req, res) =>{

    const orderItemsIds =  Promise.all(req.body.orderItems.map(async (orderItem)=>{
        let newOrderItem= new OrderItem({
            quantity: orderItem.quantity,
            product: orderItem.product
        })
        newOrderItem = await newOrderItem.save();
        return newOrderItem._id;
    }))
    const orderItemsIdsResolved = await orderItemsIds;
    const totalPrices = await Promise.all(orderItemsIdsResolved.map(async (orderItemId)=>{
        const orderItem = await OrderItem.findById(orderItemId).populate('product','price');
        return orderItem.product.price * orderItem.quantity;

    }))
    const totalPrice =totalPrices.reduce((a,b)=>a+b,0);
    console.log(totalPrice);

    let order= new Order({
        orderItems:orderItemsIdsResolved,
        shippingAddress1: req.body.shippingAddress1,
        shippingAddress2: req.body.shippingAddress2,
        city: req.body.city,
        zip: req.body.zip,
        country: req.body.country,
        phone: req.body.phone,
        status: req.body.status,
        totalPrice: totalPrice,
        user: req.body.user
    })
    order= await order.save();

    if(!order)
        return res.status(404).send('The Order cannot be Created!')

    res.send(order);
})

//updating the status of the order
router.put('/:id', async (req, res) =>{
    const order = await Order.findByIdAndUpdate(
        req.params.id,//first parameter
        { // second parameter is object
            status: req.body.status,
        },
        {// 3rd parameter an object to return the updated value
            new: true
        }
        )
    if(!order)
        return res.status(404).send('The Order cannot be Updated!')

    res.send(order);
    
})


router.delete('/:id', (req, res) =>{
    //get the id and delete by id
    Order.findByIdAndRemove(req.params.id).then(async order=>{
        if(order){
            await order.orderItems.map(async (orderItem)=>{
                await OrderItem.findByIdAndRemove(orderItem);
            })
            return res.status(200).json({success: true, message: 'The order is deleted!'})
        }else
            return res.status(404).json({success: false, message: 'The order is not found!'})
    }).catch(err => {
        return res.status(400).json({success: false, error: err})
    })
})

//get the total sales of the Business 
router.get('/get/totalsales',async (req, res) => {
    const toatalSales= await Order.aggregate([
        {$group: { _id: null, totalsales: { $sum: '$totalPrice' }}}
        //$sum a function that sums all the values in the array
        //here id: null is important bcz mongoose cannot return an object without any ID
    ]);
    if(!toatalSales){
        return res.status(400).send('The total sales cannot be generated!');
    }
    res.send({totalsales: toatalSales.pop().totalsales});
})

//how many order we have in Database- returns a number
router.get(`/get/count`, async (req,res) =>{
    const orderCount= await Order.countDocuments()
 
     if(!orderCount){
         res.status(500).json({success:false});
     }
     res.send({
         orderCount: orderCount
     });
 });
 //show order by userID
 router.get(`/get/userorders/:userid`, async (req,res) =>{
    //2 prameters the route itself //and a callback with response which is sent to client when he calls this route
    const userOrderList= await Order.find({user: req.params.userid}).populate({
        path: 'orderItems', populate: {
            path: 'product', populate: 'category'}
         }).sort({'dateOrdered': -1}); //await to get the list populated....async in=s needed now

    if(!userOrderList){
        res.status(500).json({success:false});
    }
    res.send(userOrderList);//sending to front end
});

module.exports = router;