import { Router } from 'express';
const router = Router();

import {getShitPosts,createShitPost}  from '../controllers/shitPostController.mjs';

router.get("/posts", getShitPosts);
router.post("/posts", createShitPost);

export default router;