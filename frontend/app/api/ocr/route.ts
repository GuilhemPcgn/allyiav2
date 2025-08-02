import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get('file');
  if (!file) {
    return NextResponse.json({ error: 'Aucun fichier reçu' }, { status: 400 });
  }

  // Relayer vers le backend
  const backendRes = await fetch('http://localhost:5848/ocr', {
    method: 'POST',
    body: formData,
  });
  const data = await backendRes.json();
  return NextResponse.json(data, { status: backendRes.status });
} 