import { text, blob, nat, Principal, bool, Record } from "azle";

const MetaData = Record({
    name: text,
    description: text,
    image: blob,
});

const Nft = Record({
    id: nat,
    owner: Principal,
    metaData: MetaData,
    artist: text,
    price: nat,
    onSale: bool
});

export {MetaData, Nft}