/**
 * Simple site footer component.
 *
 * Renders a basic footer with copyright info.
 */

// src/components/Footer.tsx
import React from 'react';

/**
 * Displays a simple site footer.
 */
const Footer = () => {
  return (
    <footer className="bg-gray-700 text-white p-4 mt-8">
      <div className="container mx-auto text-center">
        <p>&copy; {new Date().getFullYear()} RSG-Belgium - Placeholder Footer</p>
        {/* Social links or other info will go here */}
      </div>
    </footer>
  );
};

export default Footer;
