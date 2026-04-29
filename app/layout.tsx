import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Shared cM Relationship Predictor - Genomelink',
  description: 'Enter a shared centiMorgan value to see possible genetic relationships and their probabilities.',
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
