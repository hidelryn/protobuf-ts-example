export interface PostPB {
  path: string;
  reqMessage: string;
  resSingleMessage: string;
  resMultipleMessage: string;
}

export interface ReqPost {
  writerId: number;
  title: string;
  content: string;
  tag: string;
}

export interface ResPost {
  postId: number;
  writerId: number;
  title: string;
  content: string;
  tag: string;
  createAt: number;
  updateAt: number;
}
