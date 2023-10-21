# select user
dfx identity use default

# exhibition open
export EXHIBITION_ID=$(dfx canister call backend createExhibition '(record {name="test"; description="welcome to test exhibition"; artworks=vec {record {name="This is test works!"; description="test works"; image=vec {}; price=10; onSale=true}}; ticketImage=vec {}; ticketPrice=10})')

dfx canister call backend getArtworks '(id: ${EXHIBITION_ID})'

