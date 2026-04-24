import { NextResponse } from 'next/server';
import { Post } from '@/lib/models';
import { auth } from '@/app/api/auth/[...nextauth]/options';
import { dbConnect } from '@/lib/mongodb';

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  await dbConnect();
  
  const session = await auth();
  if (!session?.user || (session.user as any).role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const resolvedParams = await params;
    const id = resolvedParams.id;

    const deletedPost = await Post.findByIdAndDelete(id);

    if (!deletedPost) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    console.log('Post deleted successfully:', id);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('Error in DELETE /api/admin/posts/[id]:', err);
    return NextResponse.json({ 
      error: 'Internal Server Error', 
      details: err.message 
    }, { status: 500 });
  }
}
