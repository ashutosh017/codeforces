import "./globals.css";
import Header from "./components/Header";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen font-roboto">
        <Header />
        <main className="main-content">{children}</main>
        <footer className="footer">
          <p>
            © 2024 Codeforces Clone. All rights reserved.
          </p>
        </footer>
      </body>
    </html>
  );
}