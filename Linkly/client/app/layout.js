import "./globals.css";
import Navbar from "../components/Navbar";

export const metadata = {
  title: "Linkly - Shorten links, track clicks",
  description: "Linkly turns long URLs into short links with click analytics.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
        <Navbar />
        <div className="flex-1 flex flex-col">{children}</div>
      </body>
    </html>
  );
}
