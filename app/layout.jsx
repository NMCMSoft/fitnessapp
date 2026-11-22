import "./globals.css";
export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
    >
      <body className="min-h-full flex flex-col">
        <div className="wrapper">
          {children}
        </div>
      </body>
    </html>
  );
}