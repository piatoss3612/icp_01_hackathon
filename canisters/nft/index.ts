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
    ic,
    
} from 'azle';

const metaData = Record({
    name: text,
    description: text,
    image: blob,
    attributes: Vec(text),
    token: nat16
});

const metaDataList = Vec(metaData);

const nft = Record({
    id: nat16,
    owner: text,
    metaData: metaData,
    artist: text,
    price: nat16,
    onSale: bool
});

const nftList = Vec(nft); 

function getCaller(): string {
  const caller = ic.caller().toString();
  if (caller === null) {
    throw new Error("Caller is null");
  }
  return caller;
}

export default Canister({
    // metaData(메타 데이터 받기, input: name, description, image output: metaData)
    createMetaData: update([text, text, blob], metaData, (name, description, image) => {
        const newMetaData: typeof metaData = {
            name: name,
            description: description,
            image: new Uint8Array(image),
        };
        metaDataList.push(newMetaData);
        return newMetaData;;
    }),
    // getMetaData(메타 데이터 조회)
    getMetaDataList: query([text], metaData, (name) => {
        const targetMetaData = metaDataList.find((metaData) => metaData.name === name);
        if (!targetMetaData) {
            return null;
        }
        return targetMetaData;
    }),

    // balance 조회(유저가 가진 nft 개수)
    getBalance: query([text], nat16, (owner) => {
        const targetNFTList = nftList.filter((nft) => nft.owner === owner);
        return targetNFTList.length;
    }),

    // transfer(nft 전송: 유저 간 NFT 전송)
    transfer: update([text, text, nat16], text, (from, to, id) => {
        // from account가 존재하는지 확인

        // caller가 from과 같은지 확인(전송은 owner만 가능)
        const caller = getCaller();
        if (caller !== from) {
            return 'caller is not owner';
        }

        // nft id가 존재하는지 확인
        const targetNFT = nftList.find((nft) => nft.id === id);
        if (!targetNFT) {
            return 'nft is not exist';
        }
        // 해당 nft의 owner가 from과 같은지 확인
        if (targetNFT.owner !== from) {
            return 'owner is not same';
        }
        // toAccount가 존재하는지 확인, 없다면 계정 생성

        // owner 변경 == 전송
        targetNFT.owner = to;
    }),

    // mint(받는 사람 지갑으로 NFT 생성)
    mintNFT: update([text, text, nat16], nat16, (owner, artist, price) => {
        const newNFT: typeof nft = {
            owner: owner,
            id: nftList.length,
            metaData: metaData[metaDataList.length],
            artist: artist,
            price: price,
        };

        nftList.push(newNFT);
        return newNFT.id;
    }),

    // 나의 nft 조회
    getMyNFTList: query([text], nftList, (owner) => {
        const targetNFTList = nftList.filter((nft) => nft.owner === owner);
        return targetNFTList;
    }),  
});
