import { getShitPostsModel, createShitPostModel } from "../models/shitPost.mjs";
import { body, validationResult } from "express-validator";
import sanitizeHtml from "sanitize-html";

// Function to remove MongoDB operators from input
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
      // Block potential MongoDB injection patterns
      if (/^\$/.test(sanitizedValue)) {
        throw new Error(`Invalid value detected in key: ${key}`);
      }
    }
  }
  return obj; // If valid, return the object as is
};
// Middleware to sanitize request body
export const sanitizeRequestBody = (req, res, next) => {
  req.body = sanitizeInput(req.body);
  next();
};

// Get shitposts with pagination
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

// Create a new shitpost
export const createShitPost = async (req, res) => {
  console.log("Creating shitpost");
  console.log(req.body);
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

  // Check if message contains an object or array
  if (typeof req.body.message !== "string") {
    return res.status(400).json({ error: "Invalid message format. Must be a string." });
  }

  // Sanitize message
  req.body.message = sanitizeHtml(req.body.message, {
    allowedTags: [], // Remove all HTML tags
    allowedAttributes: {},
  });

  try {
    let shitPost = await createShitPostModel(req.body);
    res.status(201).json(shitPost);
  } catch (e) {
    console.error("hi",e);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
