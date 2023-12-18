import { createContext, useContext, useEffect, useState } from 'react';
import { canisterId, createActor, backend } from '../declarations/backend';
import { AuthContext } from './auth';
import { HttpAgent } from '@dfinity/agent';
import { uniqueNamesGenerator, adjectives, animals } from 'unique-names-generator';

export const BackendContext = createContext({
    isRegistered: false,
    getUser: async () => { },
    createExhibition: async (exhibition) => { },
    getExhibitions: async () => { },
    getArtworks: async (exhibitionId) => { },
    getTicket: async (ticketId) => { },
    buyTicket: async (exhibitionId) => { },
    buyArtwork: async (exhibitionId, artworkId) => { },
    getMyNftList: async () => { },
});

export const BackendProvider = ({ children }) => {
    const { identity, principal } = useContext(AuthContext);

    const [backendActor, setBackendActor] = useState(null);
    const [isRegistered, setIsRegistered] = useState(false);

    const loadBackend = () => {
        const agent = new HttpAgent({
            identity,
        })

        if (!agent) {
            throw new Error("Unable to create agent")
        }

        const backendActor = createActor(canisterId, {
            agent,
        })

        if (!backendActor) {
            throw new Error("Unable to create backend actor")
        }

        return backendActor;
    }

    const getUser = async () => {
        if (!backendActor) {
            throw new Error("Backend actor not loaded")
        }

        const resp = await backendActor.getUser(principal);

        if (!resp || !resp.length) {
            return null;
        }

        return resp[0];
    }

    const createUser = async () => {
        if (!backendActor) {
            throw new Error("Backend actor not loaded")
        }

        if (isRegistered) {
            throw new Error("User already registered")
        }

        const resp = await backendActor.createUser();

        if (!resp || !resp.length) {
            throw new Error("Unable to create user")
        }

        return resp[0];
    }

    const createExhibition = async (exhibition) => {
        if (!backendActor) {
            throw new Error("Backend actor not loaded")
        }

        if (!exhibition) {
            throw new Error("Exhibition is required")
        }

        const resp = await backendActor.createExhibition(exhibition);

        if (!resp) {
            throw new Error("Unable to create exhibition")
        }

        return resp;
    }

    const getExhibitions = async () => {
        if (!backendActor) {
            throw new Error("Backend actor not loaded")
        }

        const resp = await backendActor.getExhibitions();

        if (!resp || !resp.length) {
            return [];
        }

        return resp;
    }

    const getArtworks = async (exhibitionId) => {
        if (!backendActor) {
            throw new Error("Backend actor not loaded")
        }

        if (!exhibitionId) {
            throw new Error("Exhibition ID is required")
        }

        const resp = await backendActor.getArtworks(exhibitionId);

        if (!resp || !resp.length) {
            return [];
        }

        return resp;
    }

    const getTicket = async (ticketId) => {
        if (!backendActor) {
            throw new Error("Backend actor not loaded")
        }

        if (!ticketId) {
            throw new Error("Ticket ID is required")
        }

        const resp = await backendActor.getTicket(ticketId);

        if (!resp || !resp.length) {
            return null;
        }

        return resp[0];
    }

    const buyTicket = async (exhibitionId) => {
        if (!backendActor) {
            throw new Error("Backend actor not loaded")
        }

        if (!exhibitionId) {
            throw new Error("Exhibition ID is required")
        }

        const resp = await backendActor.buyTicket(exhibitionId);

        return resp;
    }

    const buyArtwork = async (exhibitionId, artworkId) => {
        if (!backendActor) {
            throw new Error("Backend actor not loaded")
        }

        if (!exhibitionId) {
            throw new Error("Exhibition ID is required")
        }

        if (!artworkId) {
            throw new Error("Artwork ID is required")
        }

        const resp = await backendActor.buyArtwork(exhibitionId, artworkId);

        return resp;
    }

    const getMyNftList = async () => {
        if (!backendActor) {
            throw new Error("Backend actor not loaded")
        }

        const resp = await backendActor.getMyNftList();

        if (!resp || !resp.length) {
            return [];
        }

        return resp;
    }

    useEffect(() => {
        if (identity) {
            try {
                const backendActor = loadBackend();
                setBackendActor(backendActor);
            } catch (err) {
                console.error("Error loading backend actor", err);
            }
        }
    }, [identity]);

    useEffect(() => {
        if (principal) {
            if (principal.isAnonymous()) {
                console.log("user is anonymous");
                return;
            }
        }

        if (principal && backendActor) {
            getUser(principal.toString()).then((user) => {
                if (user) {
                    console.log("user registered", user);
                    setIsRegistered(true);
                } else {
                    console.log("user not registered");

                    const config = {
                        dictionaries: [adjectives, animals],
                        separator: ' ',
                    };

                    const name = uniqueNamesGenerator(config);

                    createUser(name).then((user) => {
                        console.log("user created", user);
                        setIsRegistered(true);
                    }).catch((err) => {
                        console.log("failed to create user", err);
                    });
                }
            }).catch((err) => {
                console.log("Error getting user", err);
            });
        }
    }, [principal, backendActor]);

    return (
        <BackendContext.Provider value={{
            isRegistered,
            getUser,
            createExhibition,
            getExhibitions,
            getArtworks,
            getTicket,
            buyTicket,
            buyArtwork,
            getMyNftList,
        }}>
            {children}
        </BackendContext.Provider>
    );
};