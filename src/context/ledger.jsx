import { createContext, useContext, useState, useEffect } from 'react';
import { AuthContext } from './auth';
import { BackendContext } from './backend';
import { HttpAgent } from '@dfinity/agent';
import { canisterId, createActor } from '../declarations/ledger';
import { canisterId as backendCanisterId } from '../declarations/backend';
import { Principal } from '@dfinity/principal';

export const LedgerContext = createContext({
    getBalance: async () => { },
    approve: async () => { },
});

export const LedgerProvider = ({ children }) => {
    const { identity, principal } = useContext(AuthContext);
    const { isRegistered } = useContext(BackendContext);

    const [ledgerActor, setLedgerActor] = useState(null);

    const loadLedger = () => {
        const agent = new HttpAgent({
            identity,
        })

        if (!agent) {
            throw new Error("Unable to create agent")
        }

        const ledgerActor = createActor(canisterId, {
            agent,
        })

        if (!ledgerActor) {
            throw new Error("Unable to create ledger actor")
        }

        return ledgerActor;
    }

    const getBalance = async () => {
        if (!ledgerActor) {
            throw new Error("Ledger actor not loaded")
        }

        const resp = await ledgerActor.icrc1_balance_of({
            owner: principal,
            subaccount: [],
        });

        if (!resp) {
            return 0n;
        }

        return resp;
    }

    const approve = async (amount) => {
        if (!ledgerActor) {
            throw new Error("Ledger actor not loaded")
        }

        const resp = await ledgerActor.icrc2_approve({
            fee: [],
            memo: [],
            from_subaccount: [],
            created_at_time: [],
            amount: amount,
            expected_allowance: [],
            expires_at: [],
            spender: {
                owner: Principal.fromText(backendCanisterId),
                subaccount: [],
            },
        });

        if (!resp) {
            throw new Error("Unable to approve")
        }

        return resp;
    }

    useEffect(() => {
        if (!identity || !isRegistered) {
            return;
        }

        try {
            const ledgerActor = loadLedger();
            setLedgerActor(ledgerActor);
        } catch (err) {
            console.error('Error loading ledger actor', err);
        }
    }, [identity, isRegistered]);

    return (
        <LedgerContext.Provider value={{ getBalance, approve }}>
            {children}
        </LedgerContext.Provider>
    )
}