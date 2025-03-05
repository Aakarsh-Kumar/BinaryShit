import { Router } from 'express';
const router = Router();

import {getShitPosts,createShitPost,sanitizeRequestBody}  from '../controllers/shitPostController.mjs';

router.get("/posts", getShitPosts);
router.post("/posts",sanitizeRequestBody, createShitPost);

export default router;