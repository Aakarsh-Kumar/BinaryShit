import { getShitPostsModel, createShitPostModel } from "../models/shitPost.mjs";
import { body, validationResult } from "express-validator";
import sanitizeHtml from "sanitize-html";

// Function to remove MongoDB operators from input
const sanitizeInput = (obj) => {
  if (typeof obj !== "object" || obj === null) return obj;

  for (let key in obj) {
    if (key.startsWith("$") || key.includes(".")) {
      delete obj[key]; // Remove dangerous keys
    } else if (typeof obj[key] === "string") {
      // Sanitize string values to remove harmful content
      obj[key] = sanitizeHtml(obj[key], {
        allowedTags: [], // No HTML tags allowed
        allowedAttributes: {},
      });

      // Block potential MongoDB injection patterns
      if (/^\$/.test(obj[key])) {
        obj[key] = ""; // Remove dangerous values starting with $
      }
    } else if (typeof obj[key] === "object") {
      sanitizeInput(obj[key]); // Recursively sanitize nested objects
    }
  }
  return obj;
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

  // Sanitize request body before processing
  await body("message").notEmpty().withMessage("Message is required").run(req);
  console.log(req.body);
    
  const errors = validationResult(req);
  console.log(errors.array());
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    req.body.message = sanitizeHtml(req.body.message, {
      allowedTags: [],
      allowedAttributes: {},
    });

    let shitPost = await createShitPostModel(req.body);
    res.status(201).json(shitPost);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
