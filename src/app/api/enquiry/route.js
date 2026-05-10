import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

// POST /api/enquiry - Submit a new quote request
export async function POST(req) {
  try {
    const body = await req.json();
    const { name, email, phone, message, product_name } = body;

    if (!name || !email || !phone) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from('enquiries')
      .insert([
        {
          name,
          email,
          phone,
          message,
          product_name,
          contacted: false,
        },
      ])
      .select();

    if (error) throw error;

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Enquiry error:', error);
    return NextResponse.json({ error: 'Failed to submit enquiry' }, { status: 500 });
  }
}
