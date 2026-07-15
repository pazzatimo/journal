import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

export async function POST(req: NextRequest) {
    try {
        const secret = req.nextUrl.searchParams.get('secret');
        if (secret !== process.env.REVALIDATION_SECRET) {
            return NextResponse.json({ message: 'Invalid secret' }, { status: 401 });
        }

        // Revalidate the entire site (all pages)
        revalidatePath('/', 'layout');
        
        return NextResponse.json({ revalidated: true, now: Date.now() });
    } catch (err) {
        console.error('Revalidation error:', err);
        return NextResponse.json({ message: 'Error revalidating' }, { status: 500 });
    }
}