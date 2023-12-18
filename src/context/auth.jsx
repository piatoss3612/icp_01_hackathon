import { AuthClient } from '@dfinity/auth-client';
import { createContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const INTERNET_IDENTITY_CANISTER_ID = process.env.CANISTER_ID_INTERNET_IDENTITY ||
    process.env.INTERNET_IDENTITY_CANISTER_ID;
const LOCAL_II_URL = `http://127.0.0.1:4943/?canisterId=${INTERNET_IDENTITY_CANISTER_ID}`;

export const AuthContext = createContext({
    identity: null,
    principal: null,
    login: () => { },
    logout: () => { },
});

const AuthProvider = ({ children }) => {
    const [iiUrl, setIiUrl] = useState("");
    const [identity, setIdentity] = useState(null);
    const [principal, setPrincipal] = useState(null);
    const [authClient, setAuthClient] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        let tempIiUrl = "";

        if (process.env.DFX_NETWORK === "local") {
            tempIiUrl = LOCAL_II_URL;
        } else if (process.env.DFX_NETWORK === "ic") {
            tempIiUrl = `https://${process.env.INTERNET_IDENTITY_CANISTER_ID}.ic0.app`;
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

    const login = async () => {
        try {
            await authClient.login({
                identityProvider: iiUrl,
                onSuccess: () => {
                    const identity = authClient.getIdentity();
                    const principal = identity.getPrincipal();
                    setIdentity(identity);
                    setPrincipal(principal);
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
            navigate("/");
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <AuthContext.Provider value={{
            identity,
            principal,
            login,
            logout,
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export default AuthProvider;