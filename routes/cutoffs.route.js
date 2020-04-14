const express = require('express');
const router = express.Router();

router.route('/').post(async(req,res) =>{
  console.log('cut');
  try{
    const datum = req.body;
    console.log('datum',datum);
    return res.status(201).json({
        success: true,
        data: datum
    });
} catch(err){
    console.log(err);
    res.status(500).json({error:'Server error'});
}

});

module.exports = router;