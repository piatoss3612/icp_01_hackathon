dfx identity use default

export DEFAULT=$(dfx identity get-principal)
dfx canister call ledger icrc1_balance_of "(record { owner = principal \"${DEFAULT}\"; })"

dfx identity use bob
export BOB=$(dfx identity get-principal)

dfx canister call ledger icrc1_transfer "(record { to = record { owner = principal \"${BOB}\";};  amount = 10_00;})"

dfx canister call ledger icrc1_balance_of "(record { owner = principal \"${BOB}\"; })"

dfx identity use default

dfx canister call ledger icrc1_balance_of "(record { owner = principal \"${DEFAULT}\"; })"



