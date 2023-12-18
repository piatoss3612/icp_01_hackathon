import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/auth";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { LedgerContext } from '../context/ledger';
import { BackendContext } from '../context/backend';


const Mypage = () => {
    const { identity, principal } = useContext(AuthContext);
    const { getUser } = useContext(BackendContext);
    const { getBalance } = useContext(LedgerContext);

    const [user, setUser] = useState(null);
    const [balance, setBalance] = useState(0n);

    const navigate = useNavigate();

    useEffect(() => {
        if (!identity || !principal) {
            Swal.fire({
                title: "Login Required",
                icon: "error",
                confirmButtonText: "OK",
            }).then(() => {
                navigate("/");
            });
        }

        const loadMypage = async () => {
            const userId = principal.toText();
            const user = await getUser(userId);

            if (!user) {
                throw new Error("User not found");
            }

            setUser(user);

            const balance = await getBalance();
            setBalance(balance);
        }

        loadMypage().catch((err) => {
            Swal.fire({
                title: "Error",
                text: err.message,
                icon: "error",
                confirmButtonText: "OK",
            }).then(() => {
                navigate("/");
            });
        });
    }, [identity, principal]);

    if (!user) {
        return (
            <div style={{ marginTop: "100px", color: "white" }}>
                <h1>Mypage</h1>
                <p>Loading...</p>
            </div>
        );
    }

    return (
        <div style={{ marginTop: "100px", color: "white" }}>
            <h1>Mypage</h1>
            <p>ID: {user.id.toText()}</p>
            <p>Name: {user.name}</p>
            <p>Balance: {balance.toString()}</p>
        </div>
    );
}

export default Mypage;