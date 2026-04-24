// src/app/api/posts/route.ts
import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/mongodb';
import { Post, Comment } from '@/lib/models';
import { auth } from '../../auth/[...nextauth]/options';

// GET: সব published পোস্ট ফেচ করবে
export async function GET() {
  await dbConnect();
  try {
    const posts = await Post.find({ status: 'published' })
      .populate('authorId', 'username')
      .sort({ createdAt: -1 });

    return NextResponse.json(posts);
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST: নতুন পোস্ট তৈরি করবে (admin check সহ)
export async function POST(request: Request) {
  await dbConnect();

  const session = await auth();
  if (!session?.user || (session.user as any).role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const { title, content, excerpt, category, coverImage } = await request.json();

    if (!title || !content) {
      return NextResponse.json({ error: 'Missing required fields (title, content)' }, { status: 400 });
    }

    const newPost = await Post.create({
      title,
      content,
      excerpt,
      category,
      coverImage,
      authorId: (session.user as any).id,
    });

    return NextResponse.json({ success: true, post: newPost });
  } catch (err: any) {
    return NextResponse.json(
      { error: 'Internal Server Error', details: err.message },
      { status: 500 }
    );
  }
}


export async function DELETE(request: Request) {
  await dbConnect();

  const session = await auth();
  if (!session?.user || (session.user as any).role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const { id } = await request.json();

    if (!id) {
      return NextResponse.json({ error: 'Missing post id' }, { status: 400 });
    }

    await Post.findByIdAndDelete(id);

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json(
      { error: 'Internal Server Error', details: err.message },
      { status: 500 }
    );
  }
}