import { Toaster } from 'react-hot-toast';
import './globals.css';

export const metadata = {
  title: 'Stock Dashboard',
  description: 'Real-time stock market dashboard',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-950 text-white min-h-screen">
        <Toaster position="top-right" />
        {children}
      </body>
    </html>
  );
}