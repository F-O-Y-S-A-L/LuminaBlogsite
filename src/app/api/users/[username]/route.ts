import { NextResponse } from 'next/server';
import { User, Post } from '@/lib/models';
import { dbConnect } from '@/lib/mongodb';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ username: string }> }
) {
  await dbConnect();
  const { username } = await params;

  try {
    const user = await User.findOne({ 
      username: { $regex: new RegExp(`^${username}$`, 'i') } 
    }).select('-password');
    
    if (!user) {
      return NextResponse.json({ error: 'Identity not found in records' }, { status: 404 });
    }

    const posts = await Post.find({ authorId: user._id, status: 'published' })
      .sort({ createdAt: -1 });

    return NextResponse.json({
      user: {
        id: user._id.toString(),
        username: user.username,
        bio: user.bio || '',
        avatar: user.avatar || '',
        createdAt: user.createdAt,
      },
      posts: posts.map(p => ({
        ...p.toObject(),
        id: p._id.toString(),
        authorName: user.username
      }))
    });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
