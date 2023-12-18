dfx identity use default
export BACKEND=$(dfx canister id backend)

# create user using alice identity
dfx identity new alice
dfx identity use alice
dfx canister call backend createUser '("Alice")'
export ALICE=$(dfx identity get-principal)

echo "created user Alice with alice identity"

# create user using bob identity
dfx identity new bob
dfx identity use bob
dfx canister call backend createUser '("Bob")'
export BOB=$(dfx identity get-principal)

echo "created user Bob with bob identity"

# set identity back to default
dfx identity use default

# send token to bob for testing
dfx canister call ledger icrc1_transfer "(record { to = record { owner = principal \"${ALICE}\";};  amount = 10_00;})"
dfx canister call ledger icrc1_transfer "(record { to = record { owner = principal \"${BOB}\";};  amount = 10_00;})"

echo "sent 1000 token to Alice and Bob"

# check balance of alice and bob
dfx canister call ledger icrc1_balance_of "(record { owner = principal \"${ALICE}\"; })"
dfx canister call ledger icrc1_balance_of "(record { owner = principal \"${BOB}\"; })"

# approve backend to spend token from alice
dfx identity use alice
dfx canister call ledger icrc2_approve "(record { amount = 10; spender = record{owner = principal \"${BACKEND}\";} })"

echo "approved backend to spend token"

# alice create exhibition
export EXHIBITION_ID=$(dfx canister call backend createExhibition '(record {name="test"; description="welcome to test exhibition"; artworks=vec {record {name="This is test works!"; description="test works"; image=vec {}; price=10; onSale=true}}; ticketImage=vec {}; ticketPrice=10})')

dfx canister call backend getArtworks "("${EXHIBITION_ID}")"

# check alice's balance
dfx canister call ledger icrc1_balance_of "(record { owner = principal \"${ALICE}\"; })"

# bob approve backend to spend token
dfx identity use bob
dfx canister call ledger icrc2_approve "(record { amount = 10; spender = record{owner = principal \"${BACKEND}\";} })"

# bob buy ticket
dfx canister call backend buyTicket "("${EXHIBITION_ID}")"

# check bob's balance
dfx canister call ledger icrc1_balance_of "(record { owner = principal \"${BOB}\"; })"

# check bob's ticket
dfx canister call backend getUserTickets "( \"${BOB}\")"





