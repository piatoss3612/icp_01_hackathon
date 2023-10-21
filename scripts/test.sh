export DEFAULT=$(dfx identity get-principal)
dfx canister call backend getUser "(\"${DEFAULT}\")"