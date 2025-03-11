import { getShitPostsModel, createShitPostModel } from "../models/shitPost.mjs";
import { body, validationResult } from "express-validator";
import sanitizeHtml from "sanitize-html";

const sanitizeInput = (obj) => {
  if (typeof obj !== "object" || obj === null) return obj;

  for (let key in obj) {
    if (key.startsWith("$") || key.includes(".")) {
      throw new Error(`Invalid key detected: ${key}`);
    }

    if (typeof obj[key] === "string") {
      let sanitizedValue = sanitizeHtml(obj[key], {
        allowedTags: [],
        allowedAttributes: {},
      }).trim();
      if(sanitizedValue.length>200){
        throw new Error(`Invalid length value detected in key: ${key}`);
      }
      if (/^\$/.test(sanitizedValue)) {
        throw new Error(`Invalid value detected in key: ${key}`);
      }
    }
  }
  return obj; 
};
export const sanitizeRequestBody = async(req, res, next) => {
  try {
    const isHuman = await recaptchaVerified(req.body.captchaValue);
    if (!isHuman) {
      return res.status(400).json({ error: "Invalid reCAPTCHA token" });
    }
    delete req.body.captchaValue;

    req.body = sanitizeInput(req.body);
    next();
  } catch (error) {
    return res.status(500).json({ error: "reCAPTCHA verification failed" });
  }
};

export const getShitPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skipIndex = (page - 1) * limit;

    const shitposts = await getShitPostsModel(limit, skipIndex);
    let totalPosts = shitposts.length;

    res.status(200).json({
      posts: shitposts,
      currentPage: page,
      totalPages: Math.ceil(totalPosts / limit),
      totalPosts: totalPosts,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching shitposts",
      error: error.message,
    });
  }
};
const recaptchaVerified = async (token) => {
  const secret = process.env.RECAPTCHA_SECRET;
  const url = `https://www.google.com/recaptcha/api/siteverify?secret=${secret}&response=${token}`;
  
  const response = await fetch(url, { method: 'POST' });
  const data = await response.json();
  return data.success;
};
// Create a new shitpost
export const createShitPost = async (req, res) => {
  console.log("Creating shitpost");
  console.log(req.body.message, req.body.recipient);
  // Validate message field: must be a non-empty string
  await body("message")
    .notEmpty().withMessage("Message is required")
    .isString().withMessage("Message must be a string")
    .trim()
    .escape()
    .run(req);

    
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  if (typeof req.body.message !== "string") {
    return res.status(400).json({ error: "Invalid message format. Must be a string." });
  }

  req.body.message = sanitizeHtml(req.body.message, {
    allowedTags: [], 
    allowedAttributes: {},
  });
  try {
    let shitPost = await createShitPostModel(req.body);
    res.status(201).json(shitPost);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
