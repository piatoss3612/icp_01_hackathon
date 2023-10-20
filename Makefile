start:
	dfx start --background

start_clean:
	dfx start --clean --background

ii:
	./scripts/internet_identity.sh

ledger:
	./scripts/ledger.sh

backends:
	dfx deploy backend
	dfx generate backend

frontends:
	dfx deploy frontend

stop:
	dfx stop