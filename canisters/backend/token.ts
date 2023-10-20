import {
    Canister,
    ic,
    nat,
    nat8,
    Opt,
    query,
    text,
    Tuple,
    update,
    Principal,
    Vec
} from 'azle';
import { ICRC, Account, AllowanceArgs, AllowanceResult, ApproveArgs, ApproveResult, SupportedStandard, TransferArgs, TransferFromArgs, TransferFromResult, TransferResult, Value } from 'azle/canisters/icrc';

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

async function total_supply() {
    return await ic.call(tokenCanister.icrc1_total_supply);
}

async function balance_of(account: typeof Account) {
    return await ic.call(tokenCanister.icrc1_balance_of, {
        args: [account]
    });
}

async function transfer(transferArgs: typeof TransferArgs) {
    return await ic.call(tokenCanister.icrc1_transfer, {
        args: [transferArgs]
    });
}

async function approve(approveArgs: typeof ApproveArgs) {
    return await ic.call(tokenCanister.icrc2_approve, {
        args: [approveArgs]
    });
}

async function allowance(allowArgs: typeof AllowanceArgs) {
    return await ic.call(tokenCanister.icrc2_allowance, {
        args: [allowArgs]
    });
}

async function transfer_from(trasferFromArgs: typeof TransferFromArgs) {
    return await ic.call(tokenCanister.icrc2_transfer_from, {
        args: [trasferFromArgs]
    });
}

export {
    metadata, name, decimals, symbol, fee,
    total_supply, balance_of, transfer, approve, allowance, transfer_from
}

// Canister({
//     icrc1_metadata: query([], Vec(Tuple(text, Value)), async () => {
//         return await ic.call(tokenCanister.icrc1_metadata);
//     }),
//     icrc1_name: query([], text, async () => {
//         return await ic.call(tokenCanister.icrc1_name);
//     }),
//     icrc1_decimals: query([], nat8, async () => {
//         return await ic.call(tokenCanister.icrc1_decimals);
//     }),
//     icrc1_symbol: query([], text, async () => {
//         return await ic.call(tokenCanister.icrc1_symbol);
//     }),
//     icrc1_fee: query([], nat, async () => {
//         return await ic.call(tokenCanister.icrc1_fee);
//     }),
//     icrc1_total_supply: query([], nat, async () => {
//         return await ic.call(tokenCanister.icrc1_total_supply);
//     }),
//     icrc1_minting_account: query([], Opt(Account), async () => {
//         return await ic.call(tokenCanister.icrc1_minting_account);
//     }),
//     icrc1_balance_of: query([Account], nat, async (account) => {
//         return await ic.call(tokenCanister.icrc1_balance_of, {
//             args: [account]
//         });
//     }),
//     icrc1_transfer: update(
//         [TransferArgs],
//         TransferResult,
//         async (transferArgs) => {
//             return await ic.call(tokenCanister.icrc1_transfer, {
//                 args: [transferArgs]
//             });
//         }
//     ),
//     icrc1_supported_standards: query([], Vec(SupportedStandard), async () => {
//         return await ic.call(tokenCanister.icrc1_supported_standards);
//     }),
//     icrc2_approve: update([ApproveArgs], ApproveResult, async (approveArgs) => {
//         return await ic.call(tokenCanister.icrc2_approve, {
//             args: [approveArgs]
//         });
//     }),
//     icrc2_transfer_from: update(
//         [TransferFromArgs],
//         TransferFromResult,
//         async (transferFromArgs) => {
//             return await ic.call(tokenCanister.icrc2_transfer_from, {
//                 args: [transferFromArgs]
//             });
//         }
//     ),
//     icrc2_allowance: update(
//         [AllowanceArgs],
//         AllowanceResult,
//         async (allowanceArgs) => {
//             return await ic.call(tokenCanister.icrc2_allowance, {
//                 args: [allowanceArgs]
//             });
//         }
//     ),
// });

// export default tokenCanister;
