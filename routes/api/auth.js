const express = require('express');
const CreateError = require('http-errors');

const { User, schemas } = require('../../models/user');

const router = express.Router();

router.post('/users/signup', async (req, res, next) => {
    try {
        const { error } = schemas.signup.validate(req.body);
        if (error) {
            throw new CreateError(400, error.message)
        }
        const { email, password, subscription } = req.body;
        const user = await User.findOne({ email });
        if (user) {
            throw new CreateError(409, 'Email in use');
        }
        const result = await User.create({ email, subscription });
        res.status(201).json({
            user: {
            email: result.email,
            subscription: result.subscription,
            },
    
  })
    } catch (error) {
        next(error)
    }
})

module.exports = router;