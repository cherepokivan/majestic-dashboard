import "./globals.css";

export const metadata = {
  title: "Majestic RP API Dashboard",
  description: "Мониторинг игровых серверов Majestic",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ru">
      <body className="antialiased">{children}</body>
    </html>
  );
}
