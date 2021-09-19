import express from "express";
import { Util } from "./lib/util";
import { Post } from "./post/post";

const app = express();

app.use(Util.parseBody);

const post = new Post();

app.post("/write-post-json", (req: express.Request, res: express.Response) => {
  const writePost = post.writePostByJSON(req.body);
  return res.json(writePost);
});

app.post(
  "/write-post-pb",
   async (req: express.Request, res: express.Response) => {
    try {
      const writePost = await post.writePostByPB(req.body);
      return res.send(writePost);
    } catch (error) {
        return res.send(error);
    }
  }
);

app.get("/read-post-json", (req: express.Request, res: express.Response) => {
  const posts = post.getAllPostByJSON();
  return res.json(posts);
});

app.get(
  "/read-post-pb",
  async (req: express.Request, res: express.Response) => {
    try {
        const posts = await post.getAllPostByPB();
        return res.send(posts);
    } catch (error) {
        return res.send(error);
    }
  }
);

app.listen(3000, () => console.log("express is run!"));
