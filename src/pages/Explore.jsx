import CardList from "../components/CardList";
import { exploreList } from "../constants/MockupData";
import Search from "../components/Search";
import '../styles/Explore.css';
import { useContext, useEffect } from 'react';
import { BackendContext } from '../context/backend';

const Explore = () => {
  const { getExhibitions } = useContext(BackendContext);

  useEffect(() => {
    getExhibitions().then((exhibitions) => {
      console.log(exhibitions);
    }).catch((err) => {
      console.log(err);
    });
  }, []);

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
