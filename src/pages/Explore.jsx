import CardList from "../components/CardList";
import { exploreList } from "../constants/MockupData";
import Search from "../components/Search";
import '../styles/Explore.css';

const Explore = () => {
  return (
    <div id="explore">
      <div id="list-container">
        <CardList list={exploreList} />
      </div>
      <Search />

    </div>
  );
};

export default Explore;
