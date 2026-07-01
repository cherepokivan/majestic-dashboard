import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const endpoint = searchParams.get('endpoint');

  if (!endpoint) {
    return NextResponse.json({ error: 'Параметр endpoint отсутствует' }, { status: 400 });
  }

  // Забираем секретный ключ из переменных окружения сервера
  const apiKey = process.env.MAJESTIC_API_KEY;

  if (!apiKey) {
    return NextResponse.json({ 
      error: 'API-ключ отсутствует в настройках хостинга (MAJESTIC_API_KEY)' 
    }, { status: 500 });
  }

  const targetUrl = `https://api.majestic-files.net/v1/ext/${endpoint}`;

  try {
    const response = await fetch(targetUrl, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
        'Accept': 'application/json',
        // ПЕРЕДАЕМ ТОКЕН АВТОРИЗАЦИИ ИЗ ДОКУМЕНТАЦИИ
        'X-API-KEY': apiKey 
      },
      next: { revalidate: 120 } 
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
