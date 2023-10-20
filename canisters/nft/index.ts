import {
    blob,
    bool,
    Canister,
    nat16,
    query,
    Record,
    text,
    Vec,
    update,
    Opt,
    None,
    Some,
    nat,
    Principal,
} from 'azle';

const MetaData = Record({
    name: text,
    description: text,
    image: blob,
});

const MetaDataList: Vec<typeof MetaData> = [];

const Nft = Record({
    id: nat,
    owner: Principal,
    metaData: MetaData,
    artist: text,
    price: nat,
    onSale: bool
});

const NftList: Vec<typeof Nft> = [];

export default Canister({
    // metaData(메타 데이터 받기, input: name, description, image output: metaData)
    createMetaData: update([text, text, blob], MetaData, (name, description, image) => {
        const newMetaData: typeof MetaData = {
            name: name,
            description: description,
            image: image,
        };
        let idx = MetaDataList.push(newMetaData);
        return newMetaData;
    }),
    // getMetaData(메타 데이터 조회)
    getMetaDataList: query([text], Opt(MetaData), (name) => {
        const targetMetaData = MetaDataList.find((metaData) => metaData.name === name);
        if (!targetMetaData) {
            return None;
        }

        return Some(targetMetaData);
    }),

    // balance 조회(유저가 가진 nft 개수)
    getBalance: query([Principal], nat16, (owner) => {
        const targetNFTList = NftList.filter((nft) => nft.owner.compareTo(owner) === 'eq');
        return targetNFTList.length;
    }),

    // transfer(nft 전송: 유저 간 NFT 전송)
    transfer: update([Principal, nat], bool, (to, id) => {
        // nft id가 존재하는지 확인
        const targetNFT = NftList.find((nft) => nft.id === id);
        if (!targetNFT) {
            throw new Error('NFT not found');
        }

        // owner 변경 == 전송
        targetNFT.owner = to;

        return true;
    }),

    // mint(받는 사람 지갑으로 NFT 생성)
    mintNFT: update([Principal, text, nat], nat, (owner, artist, price) => {
        const newNFT: typeof Nft = {
            owner: owner,
            id: BigInt(NftList.length),
            metaData: MetaData[MetaDataList.length],
            artist: artist,
            price: price,
            onSale: false,
        };

        NftList.push(newNFT);
        return BigInt(newNFT.id);
    }),

    // 나의 nft 조회
    getMyNFTList: query([Principal], Vec(Nft), (owner) => {
        const targetNFTList = NftList.filter((nft) => nft.owner.compareTo(owner) === 'eq');
        return targetNFTList;
    }),
    getAllNFTList: query([], Vec(Nft), () => {
        return NftList;
    }),
});
