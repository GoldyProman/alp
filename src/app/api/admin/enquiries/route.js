import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/session';
import { supabaseAdmin } from '@/lib/supabase';

// GET /api/admin/enquiries
export async function GET(request) {
  const isAuth = await requireAuth();
  if (!isAuth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const search = searchParams.get('search') || '';
  const status = searchParams.get('status') || '';
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '20');
  const offset = (page - 1) * limit;
  const exportCsv = searchParams.get('export') === 'csv';

  let query = supabaseAdmin
    .from('enquiries')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false });

  if (search) {
    query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%,product_name.ilike.%${search}%`);
  }

  if (status === 'new') query = query.eq('contacted', false);
  if (status === 'contacted') query = query.eq('contacted', true);

  if (!exportCsv) {
    query = query.range(offset, offset + limit - 1);
  }

  const { data, error, count } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (exportCsv) {
    const csvRows = [
      ['Name', 'Email', 'Phone', 'Message', 'Product Interested In', 'Status', 'Date'].join(','),
      ...(data || []).map((e) =>
        [
          `"${e.name || ''}"`,
          `"${e.email || ''}"`,
          `"${e.phone || ''}"`,
          `"${(e.message || '').replace(/"/g, '""')}"`,
          `"${e.product_name || ''}"`,
          e.contacted ? 'Contacted' : 'New',
          new Date(e.created_at).toLocaleString('en-IN'),
        ].join(',')
      ),
    ].join('\n');

    return new NextResponse(csvRows, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="enquiries-${Date.now()}.csv"`,
      },
    });
  }

  return NextResponse.json({
    enquiries: data,
    total: count,
    page,
    limit,
    totalPages: Math.ceil((count || 0) / limit),
  });
}

// POST /api/admin/enquiries (public endpoint - called by contact form)
export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, phone, message, product_name } = body;

    if (!name || !email) {
      return NextResponse.json({ error: 'Name and email are required' }, { status: 400 });
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from('enquiries')
      .insert([{
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone?.trim() || null,
        message: message?.trim() || null,
        product_name: product_name?.trim() || null,
        contacted: false,
      }])
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, id: data.id }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}
