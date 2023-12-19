import { AuthClient } from '@dfinity/auth-client';
import { canisterId as iiCanisterId } from '../declarations/internet_identity';
import { canisterId as backendCanisterId, createActor as createBackendActor } from '../declarations/backend';
import { canisterId as ledgerCanisterId, createActor as createLedgerActor } from '../declarations/ledger';
import React, { createContext, useEffect, useState } from 'react';
import { ActorSubclass, HttpAgent, Identity } from '@dfinity/agent';
import { Principal } from '@dfinity/principal';
import { useRouter } from 'next/router';
import { _SERVICE as _BACKEND } from '../declarations/backend/backend.did';
import { _SERVICE as _LEDGER } from '../declarations/ledger/ledger.did';
import { canisterId } from '../declarations/frontend';

const LOCAL_II_URL = `http://127.0.0.1:4943/?canisterId=${iiCanisterId}`;

export const CanisterContext = createContext<
    {
        login: () => Promise<void>,
        logout: () => Promise<void>,
        identity: Identity | null,
        principal: Principal | null,
        isAuthenticated: boolean,
        backendActor: ActorSubclass<_BACKEND> | undefined,
        ledgerActor: ActorSubclass<_LEDGER> | undefined,
    }
>({
    login: async (): Promise<void> => { },
    logout: async (): Promise<void> => { },
    identity: null,
    principal: null,
    isAuthenticated: false,
    backendActor: undefined,
    ledgerActor: undefined,
});

const CanisterProvider = ({ children }: { children: React.ReactNode }) => {
    const [iiUrl, setIiUrl] = useState<string>("");
    const [authClient, setAuthClient] = useState<AuthClient | null>(null);
    const [identity, setIdentity] = useState<Identity | null>(null);
    const [principal, setPrincipal] = useState<Principal | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [backendActor, setBackendActor] = useState<ActorSubclass<_BACKEND> | undefined>();
    const [ledgerActor, setLedgerActor] = useState<ActorSubclass<_LEDGER> | undefined>();

    const router = useRouter();


    const loadBackend = (identity: Identity) => {
        const agent = new HttpAgent({
            identity
        });

        const backendActor = createBackendActor(backendCanisterId, {
            agent,
        })

        return backendActor;
    }

    const loadLedger = (identity: Identity) => {
        const agent = new HttpAgent({
            identity
        });

        const ledgerActor = createLedgerActor(ledgerCanisterId, {
            agent,
        })

        return ledgerActor;
    }

    useEffect(() => {
        let url = LOCAL_II_URL;

        if (process.env.DFX_NETWORK === 'ic') {
            url = `https://${iiCanisterId}.ic0.app`;
        }

        AuthClient.create().then((client) => {
            const identity = client.getIdentity();
            const principal = identity.getPrincipal();
            const isAuthenticated = !principal.isAnonymous();
            const backendActor = loadBackend(identity);
            const ledgerActor = loadLedger(identity);
            setIdentity(identity);
            setPrincipal(principal);
            setIsAuthenticated(isAuthenticated);
            setAuthClient(client);
            setIiUrl(url);
            setBackendActor(backendActor);
            setLedgerActor(ledgerActor);
        }).catch((err) => {
            console.log(err);
        });
    }, []);

    const login = async () => {
        if (!iiUrl || !authClient) return;

        try {
            await authClient.login({
                identityProvider: iiUrl,
                onSuccess: async () => {
                    const identity = authClient.getIdentity();
                    const principal = identity.getPrincipal();
                    const isAuthenticated = !principal.isAnonymous();
                    const backendActor = loadBackend(identity);
                    const ledgerActor = loadLedger(identity);

                    console.log("login success");

                    const users = await backendActor.getUser(principal);
                    if (!users || users.length === 0) {
                        console.log('User not found, creating user');
                        const created = await backendActor.createUser();
                        if (!created || created.length === 0) {
                            throw new Error('Failed to create user');
                        }

                        console.log('User created', created[0]);
                    }

                    setIdentity(identity);
                    setPrincipal(principal);
                    setIsAuthenticated(isAuthenticated);
                    setBackendActor(backendActor);
                    setLedgerActor(ledgerActor);

                    router.push(`/?canisterId=${canisterId}`);
                },
                onError: () => {
                    console.log("login error");
                },
            })
        } catch (err) {
            console.log(err);
        }
    }

    const logout = async () => {
        try {
            if (!authClient) return;
            if (!identity) return;
            await authClient.logout();
            setIdentity(null);
            setPrincipal(null);
            console.log("logout success");

            router.push(`/?canisterId=${canisterId}`);
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <CanisterContext.Provider value={{ login, logout, identity, principal, isAuthenticated, backendActor, ledgerActor }}>
            {children}
        </CanisterContext.Provider>
    )
}

export default CanisterProvider;