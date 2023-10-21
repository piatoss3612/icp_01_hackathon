start:
	dfx start --background

start_clean:
	dfx start --clean --background

ii:
	./scripts/internet_identity.sh

ledger:
	./scripts/ledger.sh

nft:
	dfx deploy nft

.PHONY: backend
backend:
	dfx deploy backend
	dfx generate backend

.PHONY: frontend
frontend:
	dfx deploy frontend

stop:
	dfx stop

.PHONY: create_users
create_users:
	./scripts/create_users.sh

.PHONY: create_exhibition
create_exhibition:
	./scripts/create_exhibition.sh

.PHONY: buy_artwork
buy_artwork:
	./scripts/buy_artwork.sh