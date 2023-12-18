dfx identity use default
dfx deploy backend --specified-id be2us-64aaa-aaaaa-qaabq-cai

# transfer token to backend
export BACKEND=$(dfx canister id backend)
dfx canister call ledger icrc1_transfer "(record { to = record { owner = principal \"${BACKEND}\";};  amount = 10_000_000_000;})"
dfx canister call ledger icrc1_balance_of "(record { owner = principal \"${BACKEND}\"; })"