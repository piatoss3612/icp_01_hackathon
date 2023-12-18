import { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from '../context/auth';

const Header = () => {

  const { identity, login, logout } = useContext(AuthContext);

  return (
    <div id="header">
      <Link to='/' id='logo'>Canvas</Link>
      <div id="link-containers">
        <Link to='/explore'>Explore</Link>
        {
          identity ? <>
            <Link to='/create'>Create</Link>
            <Link to='/mypage'>My Page</Link>
            <a onClick={logout}>Logout</a>
          </> : <button id="connect-wallet" onClick={login}>Connect</button>
        }
      </div>
    </div>
  );
}

export default Header;