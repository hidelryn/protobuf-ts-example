import path from "path";
import { Util } from "../lib/util";
import { PostPB, ReqPost, ResPost } from "./post.interface";

export class Post {
  private id = 0;
  private postPB: PostPB = {
    path: path.join(__dirname, "../proto/post.proto"),
    reqMessage: "ReqPost",
    resSingleMessage: "ResSinglePost",
    resMultipleMessage: "ResMultiplePost"
  };
  private postData: ResPost[] = [];
  private util: Util;

  constructor() {
    this.util = new Util();
  }

  writePostByJSON(arg: ReqPost): ResPost {
    this.incrementID();
    const currentMs = Util.getCurrentMS();
    const post: ResPost = {
      postId: this.id,
      writerId: arg.writerId,
      title: arg.title,
      content: arg.content,
      tag: arg.tag,
      createAt: currentMs,
      updateAt: currentMs,
    };
    this.postData.push(post);
    return post;
  }

  getAllPostByJSON() {
    return { posts: this.postData };
  }

  async writePostByPB(binary: Uint8Array) {
    try {
      const [decodePBLoad, resPBLoad] = await Promise.all([
        this.util.pbLoad(this.postPB.path, this.postPB.reqMessage),
        this.util.pbLoad(this.postPB.path, this.postPB.resSingleMessage),
      ]);
      const decodeMessage = this.util.pbDecode(decodePBLoad, binary);
      this.incrementID();
      const currentMs = Util.getCurrentMS();
      const post: ResPost = {
        postId: this.id,
        writerId: Number(decodeMessage.writerId), // 문자열로 나오네 toJSON()...
        title: decodeMessage.title,
        content: decodeMessage.content,
        tag: decodeMessage.tag,
        createAt: currentMs,
        updateAt: currentMs,
      };
      this.postData.push(post);
      this.util.pbVerify(resPBLoad, post);
      const encodePB = this.util.pbEncode(resPBLoad, post);
      return encodePB;
    } catch (error) {
      return error;
    }
  }

  async getAllPostByPB() {
    try {
        const pbLoad = await this.util.pbLoad(this.postPB.path, this.postPB.resMultipleMessage);
        this.util.pbVerify(pbLoad, this.postData);
        const encodePB = this.util.pbEncode(pbLoad, {posts: this.postData});
        return encodePB;
    } catch (error) {
        return error;
    }
  }

  private incrementID() {
    this.id++;
  }
}
