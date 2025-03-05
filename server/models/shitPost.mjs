import db from "./mongoClient.mjs";
export async function getShitPostsModel(limit, skipIndex) {
  let collection = db.collection("posts");
  let results = await collection.find({})
    .sort({ createdAt: -1 })
    .skip(skipIndex)
    .limit(limit)
    .toArray();
    return results.reverse();
}
export async function createShitPostModel(post) {
  post.createdAt = new Date(new Date().getTime() + 5 * 60 * 60 * 1000 + 30 * 60 * 1000);
  let collection = db.collection("posts");
  let results = await collection.insertOne(post);
  return { ...post, _id: results.insertedId };
}