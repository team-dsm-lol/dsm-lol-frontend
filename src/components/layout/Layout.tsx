import React from 'react';
import { Header } from './Header';
import { Navigation } from './Navigation';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-toss-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-6 max-w-6xl">
        {children}
      </main>
      <Navigation />
    </div>
  );
}; 