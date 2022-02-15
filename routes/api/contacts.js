const express = require('express')
const CreateError = require('http-errors');
const { Contact, schemas } = require('../../models/contact');
const { authenticate } = require('../../middlewares');

const router = express.Router()

router.get('/', authenticate, async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query;
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

router.get('/:contactId', async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const result = await Contact.findById(contactId);
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

router.delete('/:contactId', async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const result = await Contact.findByIdAndRemove(contactId);
    if (!result) {
      throw new CreateError(404, 'Not found');
    }
    res.json({message: "Contact deleted"});
  } catch (error) {
    next(error);
  }
})

router.put('/:contactId', async (req, res, next) => {
  try {
    const { error } = schemas.add.validate(req.body);
    if (error) {
      throw new CreateError(400, error.message);
    }
    const { contactId } = req.params;
    const result = await Contact.findByIdAndUpdate(contactId, req.body, {new: true});
    if (!result) {
      throw new CreateError(404, 'Not found');
    }
    res.json(result);
  } catch (error) {
    next(error)
  }
})

router.patch('/:contactId', async (req, res, next) => {
  try {
    const { error } = schemas.updateFavorite.validate(req.body);
    if (error) {
      throw new CreateError(400, error.message);
    }
    const { contactId } = req.params;
    const result = await Contact.findByIdAndUpdate(contactId, req.body, {new: true});
    if (!result) {
      throw new CreateError(404, 'Not found');
    }
    res.json(result);
  } catch (error) {
    next(error)
  }
})

module.exports = router;
