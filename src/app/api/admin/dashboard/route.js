import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/session';
import { supabaseAdmin } from '@/lib/supabase';

// GET /api/admin/dashboard - dashboard stats
export async function GET() {
  const isAuth = await requireAuth();
  if (!isAuth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const [
      { count: totalProducts },
      { count: totalCategories },
      { count: totalEnquiries },
      { count: newEnquiries },
      { count: totalLeads },
      { count: newLeads },
      { data: recentEnquiries },
      { data: recentProducts },
    ] = await Promise.all([
      supabaseAdmin.from('products').select('*', { count: 'exact', head: true }),
      supabaseAdmin.from('categories').select('*', { count: 'exact', head: true }),
      supabaseAdmin.from('enquiries').select('*', { count: 'exact', head: true }),
      supabaseAdmin.from('enquiries').select('*', { count: 'exact', head: true }).eq('contacted', false),
      supabaseAdmin.from('leads').select('*', { count: 'exact', head: true }),
      supabaseAdmin.from('leads').select('*', { count: 'exact', head: true }).eq('contacted', false),
      supabaseAdmin
        .from('enquiries')
        .select('id, name, email, product_name, created_at, contacted')
        .order('created_at', { ascending: false })
        .limit(5),
      supabaseAdmin
        .from('products')
        .select('id, name, slug, is_active, created_at')
        .order('created_at', { ascending: false })
        .limit(5),
    ]);

    return NextResponse.json({
      stats: {
        totalProducts: totalProducts || 0,
        totalCategories: totalCategories || 0,
        totalEnquiries: totalEnquiries || 0,
        newEnquiries: newEnquiries || 0,
        totalLeads: totalLeads || 0,
        newLeads: newLeads || 0,
      },
      recentEnquiries: recentEnquiries || [],
      recentProducts: recentProducts || [],
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    return NextResponse.json({ error: 'Failed to fetch dashboard data' }, { status: 500 });
  }
}
