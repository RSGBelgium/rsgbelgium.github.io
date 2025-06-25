/**
 * Simple site header component.
 *
 * Renders a basic header with the site title.
 */

// src/components/Header.tsx
import React from 'react';

/**
 * Displays a simple site header.
 */
const Header = () => {
  return (
    <header className="bg-gray-800 text-white p-4">
      <div className="container mx-auto">
        <h1 className="text-xl">RSG-Belgium - Placeholder Header</h1>
        {/* Navigation links will go here */}
      </div>
    </header>
  );
};

export default Header;
