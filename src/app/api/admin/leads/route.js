import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/session';
import { supabaseAdmin } from '@/lib/supabase';

// GET /api/admin/leads
export async function GET(request) {
  const isAuth = await requireAuth();
  if (!isAuth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const search = searchParams.get('search') || '';
  const status = searchParams.get('status') || '';
  const source = searchParams.get('source') || '';
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '20');
  const offset = (page - 1) * limit;
  const exportCsv = searchParams.get('export') === 'csv';

  let query = supabaseAdmin
    .from('leads')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false });

  if (search) {
    query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%,company.ilike.%${search}%,message.ilike.%${search}%`);
  }

  if (status === 'new') query = query.eq('contacted', false);
  if (status === 'contacted') query = query.eq('contacted', true);
  if (source) query = query.eq('source', source);

  if (!exportCsv) {
    query = query.range(offset, offset + limit - 1);
  }

  const { data, error, count } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (exportCsv) {
    const csvRows = [
      ['Name', 'Email', 'Phone', 'Company', 'City', 'Business Type', 'Source', 'Message', 'Status', 'Date'].join(','),
      ...(data || []).map((e) =>
        [
          `"${e.name || ''}"`,
          `"${e.email || ''}"`,
          `"${e.phone || ''}"`,
          `"${e.company || ''}"`,
          `"${e.city || ''}"`,
          `"${e.business_type || ''}"`,
          `"${e.source || ''}"`,
          `"${(e.message || '').replace(/"/g, '""')}"`,
          e.contacted ? 'Contacted' : 'New',
          new Date(e.created_at).toLocaleString('en-IN'),
        ].join(',')
      ),
    ].join('\n');

    return new NextResponse(csvRows, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="leads-${Date.now()}.csv"`,
      },
    });
  }

  return NextResponse.json({
    leads: data,
    total: count,
    page,
    limit,
    totalPages: Math.ceil((count || 0) / limit),
  });
}
