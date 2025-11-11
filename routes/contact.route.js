import express from 'express'
import { searchContact } from '../controller/contact.controller.js';

const contactRoute=express.Router();

contactRoute.post("/search",searchContact)

export default contactRoute