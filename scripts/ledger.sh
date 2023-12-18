# Transfers from the minting account will create Mint transactions. 
# Transfers to the minting account will create Burn transactions.
dfx identity use default

export MINTER=$(dfx identity get-principal)

# Specify the token name and symbol of your choice
export TOKEN_NAME="My Token"
export TOKEN_SYMBOL="XMTK"

# Set the default identity or the identity with which you want to deploy the ledger.
export DEFAULT=$(dfx identity get-principal)

# The number of pre-minted tokens is set to 10 billion. You may change this value to fit your ICRC-1 ledger's needs.
export PRE_MINTED_TOKENS=10_000_000_000
export TRANSFER_FEE=0

# The values set for archiving are the recommended values. You may change them to fit your ICRC-1 ledger's needs.
export ARCHIVE_CONTROLLER=$(dfx identity get-principal)
export TRIGGER_THRESHOLD=2000
export NUM_OF_BLOCK_TO_ARCHIVE=1000
export CYCLE_FOR_ARCHIVE_CREATION=10000000000000

# Specify which standards to support. If you want your ICRC-1 ledger to also support the extension standard ICRC-2 then set the flag to true.
export FEATURE_FLAGS=true

# Deploy the ledger
dfx deploy ledger --specified-id mxzaz-hqaaa-aaaar-qaada-cai --argument "(variant {Init = 
record {
     token_symbol = \"${TOKEN_SYMBOL}\";
     token_name = \"${TOKEN_NAME}\";
     minting_account = record { owner = principal \"${MINTER}\" };
     transfer_fee = ${TRANSFER_FEE};
     metadata = vec {};
     feature_flags = opt record{icrc2 = ${FEATURE_FLAGS}};
     initial_balances = vec { record { record { owner = principal \"${DEFAULT}\"; }; ${PRE_MINTED_TOKENS}; }; };
     archive_options = record {
         num_blocks_to_archive = ${NUM_OF_BLOCK_TO_ARCHIVE};
         trigger_threshold = ${TRIGGER_THRESHOLD};
         controller_id = principal \"${ARCHIVE_CONTROLLER}\";
         cycles_for_archive_creation = opt ${CYCLE_FOR_ARCHIVE_CREATION};
     };
 }
})"

# Generate declarations for the ledger canister
dfx generate ledger