import { Principal } from 'azle';
import { ICRC } from "azle/canisters/icrc";


const tokenCanister = ICRC(
    Principal.fromText('mxzaz-hqaaa-aaaar-qaada-cai')
);

export default tokenCanister;