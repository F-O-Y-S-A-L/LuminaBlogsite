import { NextResponse } from "next/server";
import { Post, Comment } from "@/lib/models";
import { dbConnect } from "@/lib/mongodb";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  await dbConnect();
  const resolvedParams = await params;
  const { id } = resolvedParams;

  try {
    const post = await Post.findOne({ _id: id, status: "published" }).populate(
      "authorId",
      "username",
    );

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    const comments = await Comment.find({ postId: post._id })
      .sort({ createdAt: -1 })
      .populate("authorId", "username");

    const postObj = post.toObject();
    const result = {
      ...postObj,
      id: postObj._id.toString(),
      authorName: postObj.authorId?.username || "Unknown",
      comments: comments.map((c) => {
        const co = c.toObject();
        return {
          ...co,
          id: co._id.toString(),
          authorName: co.authorId?.username || "Unknown",
        };
      }),
    };

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
