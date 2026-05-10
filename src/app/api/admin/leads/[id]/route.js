import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/session';
import { supabaseAdmin } from '@/lib/supabase';

// PATCH /api/admin/leads/[id] - update lead
export async function PATCH(request, { params }) {
  const isAuth = await requireAuth();
  if (!isAuth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;

  try {
    const body = await request.json();

    const { data, error } = await supabaseAdmin
      .from('leads')
      .update({ ...body })
      .eq('id', id)
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ lead: data });
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}

// DELETE /api/admin/leads/[id]
export async function DELETE(request, { params }) {
  const isAuth = await requireAuth();
  if (!isAuth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;

  const { error } = await supabaseAdmin
    .from('leads')
    .delete()
    .eq('id', id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ success: true });
}
