const express = require('express');
const path = require('path');
const fs = require('fs/promises');

const { User } = require('../../models/user');
const { authenticate, upload } = require('../../middlewares');

const router = express.Router();

router.get('/current', authenticate, async (req, res, next) => {
    res.json({
       email: req.user.email
   })
});

router.get('/logout', authenticate, async (req, res, next) => {
    const { _id } = req.user;
    await User.findByIdAndUpdate(_id, { token: '' });
    res. status(204).send()
    });

const avatarsDir = path.join(__dirname, "../../", "public", "avatars");
    
router.patch('/avatars', authenticate, upload.single("avatar"), async (req, res, next) => {
    const { path: tempUpload, filename } = req.file;
    try {
        const resultUpload = path.join(avatarsDir, filename);
        await fs.rename(tempUpload, resultUpload);
    } catch (error) {
        
}
});

module.exports = router;