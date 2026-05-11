import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'cM Clarity — Genomelink',
  description: 'Predict the relationship behind a shared cM value, with population-context adjustments for endogamous and historically intermixed groups.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{
        margin: 0,
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        WebkitFontSmoothing: 'antialiased',
      }}>
        {children}
      </body>
    </html>
  );
}
