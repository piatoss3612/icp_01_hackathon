dfx identity use default
export BACKEND=$(dfx canister id backend)

dfx identity use bob
export BOB=$(dfx identity get-principal)

# check balance of bob
dfx canister call ledger icrc1_balance_of "(record { owner = principal \"${BOB}\"; })"

# approve backend to spend token from bob
dfx canister call ledger icrc2_approve "(record { amount = 10; spender = record{owner = principal \"${BACKEND}\";} })"

# buy Artwork
dfx canister call backend buyArtwork "(\"$1\", \"$2\")"

# check balance of bob after buy
dfx canister call ledger icrc1_balance_of "(record { owner = principal \"${BOB}\"; })"

# get Artwork
dfx canister call backend getUserArtworks "( \"${BOB}\")"