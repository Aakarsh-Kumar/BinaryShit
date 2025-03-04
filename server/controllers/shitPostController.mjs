import { getShitPostsModel, createShitPostModel}  from "../models/shitPost.mjs"
export const getShitPosts = async (req, res) => {
    try {
        // Parse pagination parameters
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skipIndex = (page - 1) * limit;
    
        // Fetch shitposts with pagination
        const shitposts = await getShitPostsModel(limit, skipIndex);
    
        let totalPosts = shitposts.length;
    
        res.status(200).json({
          posts: shitposts,
          currentPage: page,
          totalPages: Math.ceil(totalPosts / limit),
          totalPosts: totalPosts
        });
      } catch (error) {
        res.status(500).json({ 
          message: "Error fetching shitposts", 
          error: error.message 
        });
      }

            
}
export const createShitPost = async (req, res) => {
    console.log("Creating shitpost");
    try {
        let shitPost = await createShitPostModel(req.body);
        res.status(201).json(shitPost);
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: "Internal Server Error" });
    }
}
