import {
    blob,
    bool,
    Canister,
    nat16,
    query,
    text,
    Vec,
    update,
    nat,
    Principal,
    StableBTreeMap,
} from 'azle';
import { MetaData, Nft } from './types';

const OwnerMap = StableBTreeMap(Principal, Vec(nat), 0);
const NftMap = StableBTreeMap(nat, Nft, 1);
const MetadataMap = StableBTreeMap(nat, MetaData, 1);

export default Canister({
    // balance 조회(유저가 가진 nft 개수)
    getBalance: query([Principal], nat16, (owner) => {
        const balanceOpt = OwnerMap.get(owner);
        if ('None' in balanceOpt) {
            return 0;
        }
        const balance = balanceOpt.Some;
        return balance.length;
    }),

    // transfer(nft 전송: 유저 간 NFT 전송)
    transfer: update([Principal, nat], bool, (to, id) => {
        // nft가 존재하는지 확인
        const nftOpt = NftMap.get(id);
        if ('None' in nftOpt) {
            throw new Error('NFT does not exist');
        }

        const targetNFT = nftOpt.Some;

        // owner가 맞는지 확인
        if (targetNFT.owner.compareTo(to) !== 'eq') {
            throw new Error('You are not the owner');
        }

        // owner의 nft list에서 해당 nft 삭제
        const ownerNFTListOpt = OwnerMap.get(targetNFT.owner);
        if ('None' in ownerNFTListOpt) {
            throw new Error('Owner does not exist');
        }

        const ownerNFTList = ownerNFTListOpt.Some;

        const newOwnerNFTList = ownerNFTList.filter((nftId) => nftId !== id);

        OwnerMap.insert(targetNFT.owner, newOwnerNFTList);

        // nft의 owner 변경
        targetNFT.owner = to;


        // to의 nft list에 해당 nft 추가
        const toNFTListOpt = OwnerMap.get(to);
        if ('None' in toNFTListOpt) {
            OwnerMap.insert(to, [id]);
        } else {
            const toNFTList = toNFTListOpt.Some.concat([id]);
            OwnerMap.insert(to, toNFTList);
        }

        // nft 업데이트
        NftMap.insert(id, targetNFT);

        return true;
    }),

    // mint(받는 사람 지갑으로 NFT 생성)
    mintNFT: update([Principal, text, text, text, blob, nat], nat, (owner, name, description, artist, image, price) => {
        // metaData 생성
        const newMetaData: typeof MetaData = {
            name: name,
            description: description,
            image: image,
        };

        // nft 생성
        const nftId = NftMap.len() + BigInt(1);

        const newNFT: typeof Nft = {
            owner: owner,
            id: nftId,
            metaData: newMetaData,
            artist: artist,
            price: price,
            onSale: false,
        };

        MetadataMap.insert(nftId, newMetaData);

        // owner의 nft list에 해당 nft 추가
        const ownerNFTListOpt = OwnerMap.get(owner);
        if ('None' in ownerNFTListOpt) {
            OwnerMap.insert(owner, [nftId]);
        } else {
            const ownerNFTList = ownerNFTListOpt.Some.concat([nftId]);
            OwnerMap.insert(owner, ownerNFTList);
        }

        // nft 추가
        NftMap.insert(nftId, newNFT);
        return nftId;
    }),

    // 나의 nft 조회
    getMyNFTList: query([Principal], Vec(Nft), (owner) => {
        // owner의 nft list 조회
        const ownerNFTListOpt = OwnerMap.get(owner);
        if ('None' in ownerNFTListOpt) {
            return [];
        }

        const ownerNFTList = ownerNFTListOpt.Some;

        // nft list 조회
        const myNFTList = ownerNFTList.map((nftId) => {
            const nftOpt = NftMap.get(nftId);
            if ('None' in nftOpt) {
                throw new Error('NFT does not exist');
            }

            return nftOpt.Some;
        });

        return myNFTList;
    }),
    // 모든 nft 조회
    getAllNFTList: query([], Vec(Nft), () => {
        const nftList = NftMap.values();
        return nftList;
    }),
});