import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const endpoint = searchParams.get('endpoint'); // Сюда прилетит например "mansions/RU1"

  if (!endpoint) {
    return NextResponse.json({ error: 'Параметр endpoint отсутствует' }, { status: 400 });
  }

  // Собираем правильный URL, о котором ты говорил
  const targetUrl = `https://api.majestic-files.net/v1/${endpoint}`;

  try {
    const response = await fetch(targetUrl, {
      method: 'GET',
      headers: {
        // Притворяемся обычным браузером, чтобы Cloudflare на Vercel меньше ругался
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
        'Accept': 'application/json',
        'Accept-Language': 'ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7',
      },
      // Кэшируем запрос на 10 секунд, чтобы не спамить API Majestic при каждом обновлении страницы
      next: { revalidate: 10 } 
    });

    if (!response.ok) {
      throw new Error(`Majestic API ответил статусом: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error('Ошибка на бэкенде:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
