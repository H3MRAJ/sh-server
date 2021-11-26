const {User}=require('../models/user'); //imports and returns an object
const express = require('express');
const router = express.Router();
const bcrypt= require('bcryptjs');
const jwt= require('jsonwebtoken');
const { ObjectID } = require('mongodb');

router.get(`/`, async (req,res) =>{
    //2 prameters the route itself //and a callback with response which is sent to client when he calls this route
    const userList= await User.find().select('-passwordHash'); //await to get the list populated....async in=s needed now

    if(!userList){ 
        res.status(500).json({success:false});
    }
    res.send(userList);//sending to front end
})

router.get('/:id', async (req,res) =>{
    const user = await User.findById(req.params.id).select('-passwordHash');
    if(!user)
        res.status(500).json({message: 'User with provided ID could not be found.'})
    res.status(200).send(user);
})

router.post('/',async (req, res) =>{
    let user= new User({
        name: req.body.name,
        email: req.body.email,
        passwordHash: bcrypt.hashSync(req.body.password, 10),
        phone: req.body.phone,
        isAdmin: req.body.isAdmin,
        streetAddress: req.body.streetAddress,
        apartment: req.body.apartment,
        zip: req.body.zip,
        city: req.body.city,
        country: req.body.country,
    })
    user= await user.save();

    if(!user)
        return res.status(404).send('The User cannot be Created!')

    res.send(user);
})

router.post('/login',async (req, res)=> {
    const user =await User.findOne({email: req.body.email})
    const secret=process.env.secret;
    if(!user){
        return res.status(400).send('The user not found');
    }
    if(user && bcrypt.compareSync(req.body.password, user.passwordHash)){
        const token = jwt.sign(
            {
                userId: user.id,
                isAdmin: user.isAdmin
            },
            secret,
            {expiresIn: '1d'}// 1 day
        )
            // user will get the token in the front end
        return res.status(200).send({user: user.email, token: token});
    }
    else{
        res.status(400).send('Password is Wrong');
    }
})
//registration
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



router.get(`/get/count`, async (req,res) =>{
    const userCount= await User.countDocuments()
 
     if(!userCount){
         res.status(500).json({success:false});
     }
     res.send({
         userCount: userCount
     });
 });

 router.delete('/:id', (req, res) =>{
    //get the id and delete by id
    User.findByIdAndRemove(req.params.id).then(user=>{
        if(user)
            return res.status(200).json({success: true, message: 'The User is deleted!'})
        else
            return res.status(404).json({success: false, message: 'The User is not found!'})
    }).catch(err => {
        return res.status(400).json({success: false, error: err})
    })
})
module.exports = router;
//if we export like this....we have to import like an object