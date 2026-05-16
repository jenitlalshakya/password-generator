import { Footer } from "@/components/Footer";
import { PasswordGenerator } from "@/components/PasswordGenerator";

const Home = () => {
  return (
    <div className="flex min-h-full flex-1 flex-col bg-gradient-to-br from-zinc-50 via-violet-50/30 to-zinc-100 dark:from-zinc-950 dark:via-violet-950/20 dark:to-black">
      <main className="flex flex-1 flex-col items-center justify-center px-4 py-12">
        <PasswordGenerator />
      </main>
      <Footer />
    </div>
  );
};

export default Home;
