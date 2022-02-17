const express = require('express')
const CreateError = require('http-errors');
const { Contact, schemas } = require('../../models/contact');
const { authenticate } = require('../../middlewares');

const router = express.Router()

router.get('/', authenticate, async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    if (isNaN(page) || isNaN(limit)) {
      throw new CreateError(400, "Page and limit must be a number")
    };
    const { _id } = req.user;
    const skip = (page - 1) * limit;
    const result = await Contact.find({ owner: _id },
      "-createdAt -updatedAt",
      { skip, limit: +limit }
    )
      .populate('owner', 'email');
  res.json(result)
  } catch (error) {
    next(error);
  }
  
})

router.get('/:contactId', authenticate, async (req, res, next) => {
  try {
    const result = await Contact.findOne({
      _id: req.params.contactId,
      owner: req.user.id,
    });
    if (!result) {
      throw new CreateError(404, 'Not found');
    }
    res.json(result);
  } catch (error) {
    if (error.message.includes('Cast to ObjectId failed for value')) {
      error.status = 404;
    }
    next(error);
  }
})

router.post('/', authenticate, async (req, res, next) => {
  try {
    const { error } = schemas.add.validate(req.body);
    if (error) {
      throw new CreateError(400, error.message);
    }
    const data = { ...req.body, owner : req.user._id };
    const result = await Contact.create(data);
    res.status(201).json(result)
  } catch (error) {
    if (error.message.includes('validation faild')) {
      error.status = 400;
    }
    next(error);
  }
})

router.delete('/:contactId', authenticate, async (req, res, next) => {
  try {
    const result = await Contact.findOneAndDelete({
      _id: req.params.contactId,
      owner: req.user._id
    });
    if (!result) {
      throw new CreateError(404, 'Not found');
    }
    res.json({message: "Contact deleted"});
  } catch (error) {
    next(error);
  }
})

router.put('/:contactId', authenticate, async (req, res, next) => {
  try {
    const { error } = schemas.add.validate(req.body);
    if (error) {
      throw new CreateError(400, error.message);
    }
    const result = await Contact.findOneAndUpdate({
      _id: req.params.contactId,
      owner: req.user._id
    }, req.body, {new: true});
    if (!result) {
      throw new CreateError(404, 'Not found');
    }
    res.json(result);
  } catch (error) {
    next(error)
  }
})

router.patch('/:contactId', authenticate, async (req, res, next) => {
  try {
    const { error } = schemas.updateFavorite.validate(req.body);
    if (error) {
      throw new CreateError(400, error.message);
    }
    const result = await Contact.findOneAndUpdate({
      _id: req.params.contactId,
      owner: req.user._id
    }, req.body, {new: true});
    if (!result) {
      throw new CreateError(404, 'Not found');
    }
    res.json(result);
  } catch (error) {
    next(error)
  }
})

module.exports = router;
