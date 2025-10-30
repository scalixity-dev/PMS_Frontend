import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="mt-auto border-t border-[var(--color-active)] bg-white">
      <div className="container mx-auto flex flex-col items-center justify-between gap-2 px-4 py-6 text-sm text-[var(--color-subheading)] md:flex-row">
        <p>&copy; {new Date().getFullYear()} PMS. All rights reserved.</p>
        <div className="flex items-center gap-4">
          <a href="https://vite.dev" target="_blank" rel="noreferrer" className="hover:text-[var(--color-active)]">Vite</a>
          <a href="https://react.dev" target="_blank" rel="noreferrer" className="hover:text-[var(--color-active)]">React</a>
          <a href="https://tailwindcss.com" target="_blank" rel="noreferrer" className="hover:text-[var(--color-active)]">Tailwind</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
