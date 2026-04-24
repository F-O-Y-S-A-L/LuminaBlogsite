import { NextResponse } from "next/server";
import { Post, User } from "@/lib/models";
import { auth } from "../../auth/[...nextauth]/options";
import { dbConnect } from "@/lib/mongodb";

export async function GET() {
  await dbConnect();

  const session = await auth();
  if (!session?.user || (session.user as any).role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const totalPosts = await Post.countDocuments();
    const totalUsers = await User.countDocuments();

    // Fetch recent activity (last 50 posts)
    const recentActivity = await Post.find({})
      .sort({ createdAt: -1 })
      .limit(50)
      .select("title createdAt _id")
      .lean();

    return NextResponse.json({
      stats: {
        totalPosts,
        totalUsers,
        systemIntegrity: (99.8 + Math.random() * 0.1).toFixed(2) + "V",
      },
      recentActivity: recentActivity.map((post: any) => ({
        id: post._id.toString(),
        title: post.title,
        createdAt: post.createdAt,
        type: "TRANS_SYNC",
      })),
    });
  } catch (err: any) {
    console.error("Error fetching admin stats:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
