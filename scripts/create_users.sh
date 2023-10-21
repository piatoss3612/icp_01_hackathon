# create user using default identity
dfx identity use default
dfx canister call backend createUser '("Alice")'

# create bob identity
dfx identity new bob
dfx identity use bob
export BOB=$(dfx identity get-principal)

# create user using bob identity
dfx canister call backend createUser '("Bob")'

# set identity back to default
dfx identity use default

# send token to bob for testing
dfx canister call ledger icrc1_transfer "(record { to = record { owner = principal \"${BOB}\";};  amount = 10_00;})"

# check bob's balance
dfx canister call ledger icrc1_balance_of "(record { owner = principal \"${BOB}\"; })"