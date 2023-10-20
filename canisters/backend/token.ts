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

function total_supply(): nat {
    const total_supply = ic.call(tokenCanister.icrc1_total_supply);
    return total_supply;
}

function balance_of(account: Account): nat {
    const balance = ic.call(tokenCanister.icrc1_balance_of, {
        args: [account]
    });
    return balance;
}

function transfer(to: Account, value: nat): TransferResult {
    const result = ic.call(tokenCanister.icrc1_transfer, {
        args: [{to, value}]
    });
    return result;
}

function approve(spender: Account, value: nat): ApproveResult {
    const result = ic.call(tokenCanister.icrc2_approve, {
        args: [{spender, value}]
    });
    return result;
}

function allowance(owner: Account, spender: Account): AllowanceResult {
    const result = ic.call(tokenCanister.icrc2_allowance, {
        args: [{owner, spender}]
    });
    return result;
}

function transfer_from(from: Account, to: Account, value: nat): TransferFromResult {
    const result = ic.call(tokenCanister.icrc2_transfer_from, {
        args: [{from, to, value}]
    });
    return result;
}


export {total_supply, balance_of, transfer, approve, allowance, transfer_from}

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
