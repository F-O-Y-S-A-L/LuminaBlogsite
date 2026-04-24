import { NextResponse } from "next/server";
import { auth } from "@/app/api/auth/[...nextauth]/options";
import {dbConnect} from "@/lib/mongodb";
import { Comment } from "@/lib/models";

export async function POST(request: Request) {
  await dbConnect();

  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { postId, content } = await request.json();

    if (!content || !postId) {
      return NextResponse.json(
        { error: "Missing content or postId" },
        { status: 400 },
      );
    }

    await Comment.create({
      postId,
      authorId: (session.user as any).id,
      content,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
