const express = require('express');

const {authenticate} = require('../../middlewares')

const router = express.Router();

router.get('/current', authenticate, async (req, res, next) => {
    try {
        console.log(req.user);
    } catch (error) {
        next(error);
    }
});

router.get('/logout', authenticate, async (req, res, next) => {
    try {
        
    } catch (error) {
        next(error);
    }
});

module.exports = router;