import Hero from "../components/Hero";
import "../styles/Home.css";
import CardList from "../components/CardList";
import { hotDropsData } from "../constants/MockupData";

const Home = () => {
  return (
    <div id="home">
      <Hero />
      <p id="card-list-header-text"> Current Hot Exhibitions </p>
      <div id="list-container">
        <CardList list={hotDropsData} />
      </div>
    </div>
  );
};

export default Home;
