import './App.css'
import { useEffect, useState } from 'react';

import { canisterId as backendId } from "./declarations/backend";

import { canisterId as iiId } from "./declarations/internet_identity";

import { Actor, HttpAgent } from "@dfinity/agent";
import { AuthClient } from "@dfinity/auth-client";

const LOCAL_II_URL = `http://127.0.0.1:4943/?canisterId=${iiId}`;

function App() {
  let [iiUrl, setIiUrl] = useState("");
  let [identity, setIdentity] = useState(null);
  let [principal, setPrincipal] = useState(null);
  let [authClient, setAuthClient] = useState(null);

  useEffect(() => {
    let tempIiUrl = "";

    if (process.env.DFX_NETWORK === "local") {
      tempIiUrl = LOCAL_II_URL;
    } else if (process.env.DFX_NETWORK === "ic") {
      tempIiUrl = `https://${process.env.INTERNET_IDENTITY_CANISTER_ID}.ic0.app`; // TODO
    } else {
      tempIiUrl = LOCAL_II_URL;
    }

    AuthClient.create().then((client) => {
      setAuthClient(client);
      setIiUrl(tempIiUrl);
    }).catch((err) => {
      console.log(err);
    });
  }, []);

  const Login = async () => {
    try {
      await authClient.login({
        identityProvider: iiUrl,
        onSuccess: () => {
          const identity = authClient.getIdentity();
          setIdentity(identity);
          console.log("login success");
        },
        onError: () => {
          console.log("login error");
        },
      });
    } catch (err) {
      console.log(err);
    }
  }

  const logout = async () => {
    try {
      if (identity) {
        await authClient.logout();
        setIdentity(null);
        setPrincipal(null);
      }
      console.log("logout success");
    } catch (err) {
      console.log(err);
    }
  }

  const request = async () => {
    let url = `http://127.0.0.1:4943/?canisterId=${backendId}`;
    try {
      const resp = await fetch(url);
      if (resp.status !== 200) {
        throw new Error("Invalid status code: " + resp.status);
      }

      const body = await resp.json();
      console.log(body);
    } catch (err) {
      console.log(err);
    }
  }

  const whoami = async () => {
    // const agent = new HttpAgent({ identity });
    // const backend = Actor.createActor(idlFactory, {
    //   agent,
    //   canisterId: backendId,
    // });
    // const principal = await backend.whoami();
    // setPrincipal(principal);
    console.log("whoami");
  };

  return (
    <>
      {identity ? <p>Logged in</p> : <button onClick={Login}>Login</button>}
      <p>{identity ? identity.getPrincipal().toString() : "Not logged in"}</p>
      {identity ? <div>
        <button onClick={logout}>Logout</button>
        <button onClick={whoami}>Call backend</button>
      </div> : ""}
      <p>{principal ? principal.toText() : ""}</p>
      <button onClick={request}>Check Headers</button>
    </>
  )
}

export default App
