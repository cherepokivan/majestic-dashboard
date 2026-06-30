import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const endpoint = searchParams.get('endpoint');

  if (!endpoint) {
    return NextResponse.json({ error: 'Эндпоинт не указан' }, { status: 400 });
  }

  const apiKey = process.env.MAJESTIC_API_KEY; 

  if (!apiKey) {
    return NextResponse.json({ error: 'API ключ не настроен на сервере Vercel' }, { status: 500 });
  }

  try {
    const res = await fetch(`https://api.majestic-rp.ru/v1/ext/${endpoint}`, {
      headers: {
        'X-API-KEY': apiKey,
        'X-LANGUAGE': 'ru'
      },
      next: { revalidate: 30 }
    });

    if (!res.ok) throw new Error(`Ошибка API: ${res.status}`);
    
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
