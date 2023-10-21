dfx identity use bob
export BOB=$(dfx identity get-principal)

# buy Artwork
dfx canister call backend buyArtwork "(${EXHIBITION_ID}, \"e4365e30-2888-4801-a94f-966cd4e0e984\")"

# get Artwork
dfx canister call backend getUserArtworks "( \"${BOB}\")"