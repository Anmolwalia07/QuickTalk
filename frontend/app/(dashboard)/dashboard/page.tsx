
import Sidebar from "@/app/Components/Sidebar";

export default function HomePage() {
  return (
    <>
    <div className="lg:w-1/4 w-full"><Sidebar/></div>
    <main className="hidden sm:flex items-center justify-center h-full w-3/4">
      <h1 className="text-3xl font-bold">Welcome to the Main Page</h1>
    </main>
    </>
  );
}
