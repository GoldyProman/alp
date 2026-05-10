import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

// POST /api/leads - Submit a new lead (from contact or dealer forms)
export async function POST(req) {
  try {
    const body = await req.json();
    const { 
      name, 
      email, 
      phone, 
      company, 
      city, 
      business_type, 
      subject, 
      message, 
      source 
    } = body;

    if (!name || !email || !source) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from('leads')
      .insert([
        {
          name,
          email,
          phone,
          company,
          city,
          business_type,
          subject,
          message,
          source,
          contacted: false,
        },
      ])
      .select();

    if (error) throw error;

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Lead submission error:', error);
    return NextResponse.json({ error: 'Failed to submit lead' }, { status: 500 });
  }
}
