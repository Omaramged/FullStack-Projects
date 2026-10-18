import "./globals.css";

export const metadata = {
  title: "Compiler Code — Your Code. Your Space. Your Flow.",
  description:
    "A focused coding workspace to build projects, experiment with ideas, and run your code without the friction of a complicated setup.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                if (localStorage.getItem("theme") === "light") {
                  document.documentElement.classList.add("light");
                }
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
