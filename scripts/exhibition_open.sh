# create user using default identity
dfx identity use default
dfx canister call backend createUser '("Alice")'


# create bob identity
# dfx identity new bob
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

# exhibition open("Alice")
export EXHIBITION_ID=$(dfx canister call backend createExhibition '(record {name="test"; description="welcome to test exhibition"; artworks=vec {record {name="This is test works!"; description="test works"; image=vec {}; price=10; onSale=true}}; ticketImage=vec {}; ticketPrice=10})')

dfx canister call backend getArtworks "("${EXHIBITION_ID}")"

dfx identity use bob

# buy ticket
dfx canister call backend buyTicket "("${EXHIBITION_ID}")"

# check bob's ticket
dfx canister call backend getUserTickets "( \"${BOB}\")"

# get Artwork in exhibition
dfx canister call backend getArtworks "("${EXHIBITION_ID}")"

# export ID= "8c01398214444904b60fbfe7b0aa76d8"

# buy Artwork
dfx canister call backend buyArtwork "(${EXHIBITION_ID}, \"e4365e30-2888-4801-a94f-966cd4e0e984\")"

# get Artwork
dfx canister call backend getUserArtworks "( \"${BOB}\")"





