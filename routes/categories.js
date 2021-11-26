

const {Category}=require('../models/category');
const express = require('express');
const router = express.Router();

router.get(`/`, async (req,res) =>{
    //2 prameters the route itself //and a callback with response which is sent to client when he calls this route
    const categoryList= await Category.find(); //await to get the list populated....async in=s needed now

    if(!categoryList){
        res.status(500).json({success:false});
    }
    res.status(200).send(categoryList);//sending to front end
});

router.get('/:id', async (req,res) =>{// get category by ID
    const category = await Category.findById(req.params.id)
    if(!category)
        res.status(500).json({message: 'Category with provided ID could not be found.'})
    res.status(200).send(category);
})


//add a category
router.post('/',async (req, res) =>{
    let category= new Category({
        name: req.body.name,
        icon: req.body.icon,
        color: req.body.color,
    })
    category= await category.save();

    if(!category)
        return res.status(404).send('The Category cannot be Created!')

    res.send(category);
})

//update a category by ID
router.put('/:id', async (req, res) =>{
    const category = await Category.findByIdAndUpdate(
        req.params.id,//first parameter
        { // second parameter is object
            name: req.body.name,
            icon: req.body.icon || category.icon,
            color: req.body.color,
        },
        {// 3rd parameter an object to return the updated value
            new: true
        }
        )
    if(!category)
        return res.status(404).send('The Category cannot be Updated!')

    res.send(category);
    
})

router.delete('/:id', (req, res) =>{
    //get the id and delete by id
    Category.findByIdAndRemove(req.params.id).then(category=>{
        if(category)
            return res.status(200).json({success: true, message: 'The category is deleted!'})
        else
            return res.status(404).json({success: false, message: 'The category is not found!'})
    }).catch(err => {
        return res.status(400).json({success: false, error: err})
    })
})
module.exports = router;