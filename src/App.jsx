import './App.css'
import { useContext } from 'react';
import { AuthContext } from './context/auth';

function App() {
  const { identity, principal, Login, logout } = useContext(AuthContext);

  return (
    <>
      {identity ? <p>Logged in</p> : <button onClick={Login}>Login</button>}
      <p>{identity ? identity.getPrincipal().toString() : "Not logged in"}</p>
      {identity ? <div>
        <button onClick={logout}>Logout</button>
        {/* <button onClick={whoami}>Call backend</button> */}
      </div> : ""}
      <p>{principal ? principal.toText() : ""}</p>
    </>
  )
}

export default App
