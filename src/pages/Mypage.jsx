import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/auth";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { LedgerContext } from '../context/ledger';
import { BackendContext } from '../context/backend';


const Mypage = () => {
    const { identity, principal } = useContext(AuthContext);
    const { isRegistered } = useContext(BackendContext);
    const { getBalance } = useContext(LedgerContext);

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

    if (!isRegistered) {
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
            <p>ID: {principal.toText()}</p>
            <p>Balance: {balance.toString()}</p>
        </div>
    );
}

export default Mypage;