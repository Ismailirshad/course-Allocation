import "./globals.css";

export const metadata = {
  title: "Course Allocation System",
  description: "Next.js AI-powered student course allocation system",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

