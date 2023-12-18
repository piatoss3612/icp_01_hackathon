import { Principal, blob, ic, nat, text } from 'azle';
import NftCanister from "../nft";

const nftCanister = NftCanister(
    Principal.fromText('bd3sg-teaaa-aaaaa-qaaba-cai')
);

const mintNFT = async (owner: Principal, name: text, description: text, artist: text, image: blob, price: nat) => {
    const nftId = await ic.call(nftCanister.mintNFT, {
        args: [owner, name, description, artist, image, price],
    });
    return nftId;
}

const getMyNftList = async (owner: Principal) => {
    const myNFTList = await ic.call(nftCanister.getMyNFTList, {
        args: [owner],
    })

    return myNFTList;
}

export {
    mintNFT,
    getMyNftList
}