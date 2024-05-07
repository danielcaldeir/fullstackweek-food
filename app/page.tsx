import Header from "@/components/header";
import Search from "@/components/search";

const Home = () => {
    return (
      <main className="flex min-h-screen flex-row items-center justify-between p-24">
        <Header />
        <div className="px-5 pt-6">
          <Search />
        </div>
      </main>
    );
}
  
export default Home;