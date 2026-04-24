import { NextResponse } from 'next/server';
import {dbConnect} from '@/lib/mongodb';
import { Post } from '@/lib/models';
import { auth } from '../../auth/[...nextauth]/options';

export async function POST(request: Request) {
  await dbConnect();
  
  const session = await auth();
  if (!session?.user || (session.user as any).role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const { title, slug, content, excerpt, category, coverImage } = await request.json();

    if (!title || !slug || !content) {
      return NextResponse.json({ error: 'Missing required fields (title, slug, content)' }, { status: 400 });
    }

    const newPost = await Post.create({
      title,
      slug,
      content,
      excerpt,
      category,
      coverImage,
      authorId: (session.user as any).id
    });

    console.log('Post created successfully:', newPost._id);
    return NextResponse.json({ success: true, post: newPost });
  } catch (err: any) {
    console.error('Error in POST /api/admin/posts:', err);
    return NextResponse.json({ 
      error: 'Internal Server Error', 
      details: err.message,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    }, { status: 500 });
  }
}
