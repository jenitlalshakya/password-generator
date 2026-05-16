const currentYear = new Date().getFullYear();

export const Footer = () => {
  return (
    <footer className="w-full border-t border-zinc-200/80 bg-white/60 px-4 py-6 backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-950/60">
      <div className="mx-auto flex max-w-lg flex-col items-center gap-2 text-center text-xs text-zinc-500 dark:text-zinc-400 sm:flex-row sm:justify-between sm:text-left">
        <p>
          © {currentYear} Password Generator. All passwords are generated locally
          in your browser.
        </p>
        <p className="text-zinc-400 dark:text-zinc-500">
          No data stored · No server required
        </p>
      </div>
    </footer>
  );
};
