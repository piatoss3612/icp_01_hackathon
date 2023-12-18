import {
    ic,
    Principal
} from 'azle';
import { ICRC, Account, AllowanceArgs, ApproveArgs, TransferArgs, TransferFromArgs } from 'azle/canisters/icrc';

const tokenCanister = ICRC(
    Principal.fromText('mxzaz-hqaaa-aaaar-qaada-cai')
);

const metadata = async () => {
    return await ic.call(tokenCanister.icrc1_metadata);
}

const name = async () => {
    return await ic.call(tokenCanister.icrc1_name);
}

const decimals = async () => {
    return await ic.call(tokenCanister.icrc1_decimals);
}

const symbol = async () => {
    return await ic.call(tokenCanister.icrc1_symbol);
}

const fee = async () => {
    return await ic.call(tokenCanister.icrc1_fee);
}

const total_supply = async () => {
    return await ic.call(tokenCanister.icrc1_total_supply);
}

const balance_of = async (account: typeof Account) => {
    return await ic.call(tokenCanister.icrc1_balance_of, {
        args: [account]
    });
}

const transfer = async (transferArgs: typeof TransferArgs) => {
    return await ic.call(tokenCanister.icrc1_transfer, {
        args: [transferArgs]
    });
}

const approve = async (approveArgs: typeof ApproveArgs) => {
    return await ic.call(tokenCanister.icrc2_approve, {
        args: [approveArgs]
    });
}

const allowance = async (allowArgs: typeof AllowanceArgs) => {
    return await ic.call(tokenCanister.icrc2_allowance, {
        args: [allowArgs]
    });
}

const transfer_from = async (transferFromArgs: typeof TransferFromArgs) => {
    return await ic.call(tokenCanister.icrc2_transfer_from, {
        args: [transferFromArgs]
    });
}

export {
    metadata, name, decimals, symbol, fee,
    total_supply, balance_of, transfer, approve, allowance, transfer_from
}
