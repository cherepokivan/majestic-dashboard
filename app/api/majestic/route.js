import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const endpoint = searchParams.get('endpoint'); // Сюда прилетит например "mansions/RU5"

  if (!endpoint) {
    return NextResponse.json({ error: 'Параметр endpoint отсутствует' }, { status: 400 });
  }

  // ДОБАВЛЯЕМ /ext/ РОВНО КАК В ДОКУМЕНТАЦИИ К API
  const targetUrl = `https://api.majestic-files.net/v1/ext/${endpoint}`;

  try {
    const response = await fetch(targetUrl, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
        'Accept': 'application/json',
      },
      next: { revalidate: 10 } 
    });

    if (!response.ok) {
      throw new Error(`API ответил статусом: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error('Ошибка бэкенда:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
