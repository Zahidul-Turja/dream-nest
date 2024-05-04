import Categories from "../components/Categories";
import Listings from "../components/Listings";
import Navbar from "../components/Navbar";
import Slide from "../components/Slide";

function HomePage() {
  return (
    <div>
      <Navbar />
      <Slide />
      <Categories />
      <Listings />
    </div>
  );
}

export default HomePage;
