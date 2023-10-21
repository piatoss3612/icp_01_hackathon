import { Principal, blob, ic, nat, text } from 'azle';
import NftCanister from "../nft";

const nftCanister = NftCanister(
    Principal.fromText('be2us-64aaa-aaaaa-qaabq-cai')
);

const mintNFT = async (owner: Principal, name: text, description: text, artist: text, image: blob, price: nat) => {
    const nftId = await ic.call(nftCanister.mintNFT, {
        args: [owner, name, description, artist, image, price],
    });
    return nftId;
}

const getNftCollection = async (owner: Principal) => {
    const nftList = await ic.call(nftCanister.getMyNFTList, {
        args: [owner],
    });
    return nftList;
}

const createMetaData = async (name: text, description: text, image: blob) => {
    const metaData = await ic.call(nftCanister.createMetaData, {
        args: [name, description, image],
    });
    return metaData;
}

const getMyNFTList = async (owner: Principal) => {
    const myNFTList = await ic.call(nftCanister.getMyNFTList, {
        args: [owner],
    })

    return myNFTList;
}

export {
    mintNFT,
    getNftCollection,
    createMetaData,
    getMyNFTList
}