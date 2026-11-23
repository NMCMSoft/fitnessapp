import "./globals.css";
export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
    >
      <body className="min-h-full flex flex-col">
        <div className="header-strip">
          <h1>GRP 36 AFE OPGAVE 2</h1>
          <h3>Fitness App</h3>
        </div>
        <div className="wrapper">
          {children}
        </div>
      </body>
    </html>
  );
}