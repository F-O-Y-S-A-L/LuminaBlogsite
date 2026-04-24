import { NextResponse } from 'next/server';
import {dbConnect} from '@/lib/mongodb';
import { Post } from '@/lib/models';

export async function GET(request: Request) {
  await dbConnect();
  
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  const search = searchParams.get('search');

  let filter: any = { status: 'published' };

  if (category) {
    filter.category = category;
  }
  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: 'i' } },
      { content: { $regex: search, $options: 'i' } }
    ];
  }

  try {
    const posts = await Post.find(filter)
      .sort({ createdAt: -1 })
      .populate('authorId', 'username');
    
    // Map authorId to authorName for frontend compatibility
    const mappedPosts = posts.map(post => {
      const p = post.toObject();
      return {
        ...p,
        id: p._id.toString(),
        authorName: p.authorId?.username || 'Unknown'
      };
    });

    return NextResponse.json(mappedPosts);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 });
  }
}
