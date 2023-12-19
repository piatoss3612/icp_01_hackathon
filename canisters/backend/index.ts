import {
    bool,
    Canister,
    ic,
    nat,
    None,
    Opt,
    Principal,
    query,
    Some,
    StableBTreeMap,
    text,
    update,
    Vec,
} from 'azle';
import { Artwork, Comment, CreateExhibitionArgs, Exhibition, Ticket, User } from './types';
import { transfer, transfer_from } from './token';
import { mintNFT, getMyNftList } from './nft';
import { Account } from 'azle/canisters/icrc';
import { Nft } from '../nft/types';

type Exhibition = typeof Exhibition;
type Artwork = typeof Artwork;
type Ticket = typeof Ticket;
type Comment = typeof Comment;
type User = typeof User;

// 메모리 내에 저장되는 데이터
// 메모리 id가 달라야 함 -> 같으면 타입 에러 발생
let userMap = StableBTreeMap(Principal, User, 0);

let exhibitionMap = StableBTreeMap(text, Exhibition, 1);

let artworkMap = StableBTreeMap(text, Artwork, 2);

let ticketMap = StableBTreeMap(text, Ticket, 3);

let commentMap = StableBTreeMap(text, Comment, 4);

const exhibitionCost = 10n; // 전시장 생성 비용

const findUser = (id: Principal): User => {
    const userOpt = userMap.get(id);
    if ("None" in userOpt) {
        throw new Error("User not found");
    }

    return userOpt.Some;
}

const findExhibition = (id: text): Exhibition => {
    const exhibitionOpt = exhibitionMap.get(id);
    if ("None" in exhibitionOpt) {
        throw new Error("Exhibition not found");
    }

    return exhibitionOpt.Some;
}

const getExhibitions = (): Exhibition[] => {
    const exhibitions = exhibitionMap.values();
    return exhibitions;
}

const findArtwork = (id: text): Artwork => {
    const artworkOpt = artworkMap.get(id);
    if ("None" in artworkOpt) {
        throw new Error("Artwork not found");
    }

    return artworkOpt.Some;
}

const findComment = (id: text): Comment => {
    const commentOpt = commentMap.get(id);
    if ("None" in commentOpt) {
        throw new Error("Comment not found");
    }

    return commentOpt.Some;
}

const generateRandomUUID = (): string => {
    const hexChars = "0123456789abcdef";
    let uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx";

    uuid = uuid.replace(/[xy]/g, function (c) {
        const r = (Math.random() * 16) | 0;
        const v = c === "x" ? r : (r & 0x3) | 0x8;
        return hexChars[v];
    });

    return uuid;
}

export default Canister({
    // 유저 존재 여부 확인 -> Opt<User> 타입 리턴
    getUser: query([Principal], Opt(User), (key) => {
        return userMap.get(key);
    }),
    // 유저 생성 -> Opt<bool> 타입 리턴
    createUser: update([], Opt(User), async () => {
        // 1. 유저 principal 확인
        const caller = ic.caller();

        if (caller === null) {
            console.log("Caller is null");
            throw new Error("Caller is null");
        }

        if (caller.isAnonymous()) {
            console.log("Caller is anonymous");
            throw new Error("Caller is anonymous");
        }

        // 2. 유저가 존재하는지 확인
        if (userMap.containsKey(caller)) {
            console.log("User already exists");
            return None;
        }

        const user: typeof User = {
            id: caller,
        };

        // 3. 초기 토큰 지급
        const toAccount: typeof Account = {
            owner: caller,
            subaccount: None,
        };

        await transfer({
            from_subaccount: None,
            to: toAccount,
            amount: 50n,
            fee: None,
            memo: None,
            created_at_time: None,
        })

        // 4. 유저 저장
        userMap.insert(caller, user);

        return Some(user);
    }),
    // 전시장 정보 조회 (전시장 id) -> Opt<Exhibition> 타입 리턴
    getExhibition: query([text], Opt(Exhibition), (id) => {
        return exhibitionMap.get(id);
    }),
    // 모든 전시장 정보 조회 -> Vec<Exhibition> 타입 리턴
    getExhibitions: query([], Vec(Exhibition), () => {
        return getExhibitions();
    }),
    // 전시장 생성 비용 조회 -> nat 타입 리턴
    getExhibitionCost: query([], nat, () => {
        return exhibitionCost;
    }),
    // 작품 정보 조회 (작품 id) -> Opt<Artwork> 타입 리턴
    getArtwork: query([text], Opt(Artwork), (id) => {
        return artworkMap.get(id);
    }),
    // 전시장 작품 정보 조회 (전시장 id) -> Vec<Artwork> 타입 리턴
    getArtworks: query([text], Vec(Artwork), (exhibitionId) => {
        // 1. 전시장 존재하는지 확인
        const exhibition = findExhibition(exhibitionId);

        // 2. 전시장에 속한 작품들 조회
        const artworks: typeof Artwork[] = [];

        for (let i = 0; i < exhibition.artworks.length; i++) {
            const artworkOpt = artworkMap.get(exhibition.artworks[i]);
            if (!("None" in artworkOpt)) {
                artworks.push(artworkOpt.Some);
            }
        }

        return artworks;
    }),
    // 전시장 생성 (이름, 설명, 작품들, 티켓 가격, 티켓 이미지) -> text 타입 리턴
    createExhibition: update([CreateExhibitionArgs], text, async (args) => {
        const caller = ic.caller();

        // 1. 유저가 존재하는지 확인
        const user = findUser(caller);

        // 2. 전시장 생성 비용 확인
        const cost = exhibitionCost;

        // 3. 파라미터 유효성 검사 (TODO: 작품들이 유효한지 검사)
        if (args.name.length > 20 || args.description.length > 100 ||
            args.artworks.length <= 0 || args.artworks.length > 5) {
            throw new Error("Invalid parameters to create exhibition");
        }

        // 4. 전시장 생성 비용 지불
        // caller가 cost 만큼의 ICX를 canister에게 전송
        const fromAccount: typeof Account = {
            owner: caller,
            subaccount: None,
        };

        const toAccount: typeof Account = {
            owner: ic.id(),
            subaccount: None,
        };

        await transfer_from({
            from: fromAccount,
            to: toAccount,
            amount: cost,
            fee: None,
            memo: None,
            created_at_time: None,
        });

        // 5. 전시장 id 및 티켓 id 생성
        const exhibitionId = generateRandomUUID();
        const ticketId = generateRandomUUID();

        // 6. 작품들 생성
        const artworks: string[] = [];

        for (let i = 0; i < args.artworks.length; i++) {
            const artworkId = generateRandomUUID();

            const artwork: typeof Artwork = {
                id: artworkId,
                name: args.artworks[i].name,
                description: args.artworks[i].description,
                owner: caller,
                price: args.artworks[i].price,
                onSale: args.artworks[i].onSale,
                image: args.artworks[i].image,
                exhibition: exhibitionId,
                comments: [],
            }

            artworks.push(artworkId);
            artworkMap.insert(artworkId, artwork);
        }

        // 7. 티켓 생성
        const ticket: typeof Ticket = {
            id: ticketId,
            exhibition: exhibitionId,
            price: args.ticketPrice,
            image: args.ticketImage,
        }

        // 8. 전시장 생성
        const exhibition: typeof Exhibition = {
            id: exhibitionId,
            ticket: ticket,
            owner: caller,
            name: args.name,
            description: args.description,
            artworks: artworks,
            ticketHolders: [],
            onExhibition: true,
        }

        // 9. 전시장 및 티켓 저장
        exhibitionMap.insert(exhibitionId, exhibition);
        ticketMap.insert(ticketId, ticket);

        // 10. 전시장 id 리턴
        return exhibitionId;
    }),
    // 전시 마감 (전시장 id) -> bool 타입 리턴
    closeExhibition: update([text], bool, (exhibitionId) => {
        // 1. 유저 principal 확인
        const caller = ic.caller();

        // 2. 유저가 존재하는지 확인
        findUser(caller);

        // 3. 전시장 존재하는지 확인
        const exhibition = findExhibition(exhibitionId);

        // 4. 전시장이 전시중인지 확인
        if (!exhibition.onExhibition) {
            return false;
        }

        // 5. 전시장 소유자인지 확인
        if (exhibition.owner.compareTo(caller) !== 'eq') {
            return false;
        }

        // 6. 전시 마감
        exhibition.onExhibition = false;

        // 7. 전시장 저장
        exhibitionMap.insert(exhibitionId, exhibition);

        return true;
    }),
    // 티켓 정보 조회 (티켓 id) -> Opt<Ticket> 타입 리턴
    getTicket: query([text], Opt(Ticket), (id) => {
        return ticketMap.get(id);
    }),
    // 티켓 소지 여부 확인 (전시장 id) -> bool 타입 리턴
    hasTicket: query([text], bool, (exhibitionId) => {
        // 1. 유저 principal 확인
        const caller = ic.caller();

        // 2. 유저가 존재하는지 확인
        const user = findUser(caller);

        // 3. 전시장 존재하는지 확인
        const exhibition = findExhibition(exhibitionId);

        for (let i = 0; i < exhibition.ticketHolders.length; i++) {
            if (exhibition.ticketHolders[i].compareTo(caller) === 'eq') {
                return true;
            }
        }

        return false;
    }),
    // 티켓 구매 (전시장 id) -> bool 타입 리턴
    buyTicket: update([text], bool, async (exhibitionId) => {
        // 1. 유저 principal 확인
        const caller = ic.caller();

        // 2. 유저가 존재하는지 확인
        const user = findUser(caller);

        // 3. 전시장 존재하는지 확인
        const exhibition = findExhibition(exhibitionId);

        // 4. 전시장이 전시중인지 확인
        if (!exhibition.onExhibition) {
            return false;
        }

        // 5. 이미 티켓을 구매했는지 확인
        for (let i = 0; i < exhibition.ticketHolders.length; i++) {
            if (exhibition.ticketHolders[i].compareTo(caller) === 'eq') {
                return false;
            }
        }

        // 6. 전시장 티켓 가격 확인
        const ticket = exhibition.ticket;

        // 7. 티켓 구매
        // caller가 ticket.price 만큼의 ICX를 exhibition owner에게 전송
        const fromAccount: typeof Account = {
            owner: caller,
            subaccount: None,
        };

        const toAccount: typeof Account = {
            owner: exhibition.owner,
            subaccount: None,
        }
        const result = await transfer_from({
            from: fromAccount,
            to: toAccount,
            amount: ticket.price,
            fee: None,
            memo: None,
            created_at_time: None,
        });
        console.log(result);

        // 7-2. 티켓 NFT mint
        await mintNFT(caller, exhibition.name, exhibition.description,
            exhibition.owner.toText(), ticket.image, ticket.price);

        // 8. 티켓 저장
        exhibition.ticketHolders.push(caller);
        exhibitionMap.insert(exhibitionId, exhibition);

        return true;
    }),
    // 작품 구매 (전시장 id, 작품 id) -> bool 타입 리턴
    buyArtwork: update([text, text], bool, async (exhibitionId, artworkId) => {
        // 1. 유저 principal 확인
        const caller = ic.caller();

        // 2. 유저가 존재하는지 확인
        const user = findUser(caller);

        // 3. 전시장 존재하는지 확인
        const exhibition = findExhibition(exhibitionId);

        // 4. 전시장이 전시중인지 확인
        if (!exhibition.onExhibition) {
            return false;
        }

        // 5. 유저가 티켓을 소지하고 있는지 확인
        let hasTicket = false;

        for (let i = 0; i < exhibition.ticketHolders.length; i++) {
            if (exhibition.ticketHolders[i].compareTo(caller) === 'eq') {
                hasTicket = true;
                break;
            }
        }

        if (!hasTicket) {
            return false;
        }

        // 6. 작품 존재하는지 확인
        const artwork = findArtwork(artworkId);

        // 7. 작품이 판매중인지 확인
        if (!artwork.onSale) {
            return false;
        }

        // 8. 작품 가격 확인
        const price = artwork.price;

        // 9. 작품 구매
        const fromAccount: typeof Account = {
            owner: caller,
            subaccount: None,
        };
        const toAccount: typeof Account = {
            owner: exhibition.owner,
            subaccount: None,
        }

        // 10. 작품 가격만큼의 ICX를 artwork.owner에게 전송
        const buyArtwork = await transfer_from({
            from: fromAccount,
            to: toAccount,
            amount: price,
            fee: None,
            memo: None,
            created_at_time: None,
        });

        if (!buyArtwork.Ok) {
            throw new Error("Failed to buy artwork");
        }

        // 11. 작품 NFT mint       
        const nftId = await mintNFT(caller, artwork.name, artwork.description,
            exhibition.owner.toText(), artwork.image, price);

        artwork.onSale = false;

        // 12. 작품 저장
        artworkMap.insert(artworkId, artwork);

        return true;
    }),
    // 작품 감상평 조회 (작품 id) -> Vec<Comment> 타입 리턴
    getComments: query([text], Vec(Comment), (artworkId) => {
        // 1. 작품 존재하는지 확인
        const artwork = findArtwork(artworkId);

        // 2. 작품에 달린 감상평들 조회
        const comments: typeof Comment[] = [];

        for (let i = 0; i < artwork.comments.length; i++) {
            const commentOpt = commentMap.get(artwork.comments[i]);
            if (!("None" in commentOpt)) {
                comments.push(commentOpt.Some);
            }
        }

        return comments;
    }),
    // 14. 감상평 작성 (전시장 id, 작품 id, 감상평 내용) -> bool 타입 리턴
    writeComment: update([text, text, text], bool, (exhibitionId, artworkId, content) => {
        // 1. 유저 principal 확인
        const caller = ic.caller();

        // 2. 유저가 존재하는지 확인
        const user = findUser(caller);

        if (!user) {
            return false;
        }

        // 3. 전시장 존재하는지 확인
        const exhibition = findExhibition(exhibitionId);

        // 4. 전시장이 전시중인지 확인
        if (!exhibition.onExhibition) {
            return false;
        }

        // 5. 작품 존재하는지 확인
        const artwork = findArtwork(artworkId);

        // 6. 작품이 판매중인지 확인
        if (!artwork.onSale) {
            return false;
        }

        // 7. 감상평 작성
        const commentId = generateRandomUUID();

        const comment: typeof Comment = {
            id: commentId,
            owner: caller,
            exhibition: exhibition.id,
            content: content,
            adopted: false,
        }

        // 8. 감상평 저장
        artwork.comments.push(commentId);
        artworkMap.insert(artworkId, artwork);
        commentMap.insert(commentId, comment);

        return true;
    }),
    // 15. 감상평 채택 (전시장 id, 작품 id, 감상평 id) -> bool 타입 리턴
    adoptComment: update([text, text, text, nat], bool, async (exhibitionId, artworkId, commentId) => {
        // 1. 유저 principal 확인
        const caller = ic.caller();

        // 2. 유저가 존재하는지 확인
        const user = findUser(caller);

        // 3. 전시장 존재하는지 확인
        const exhibition = findExhibition(exhibitionId);

        // 4. 전시장의 소유자인지 확인 
        if (exhibition.owner.compareTo(caller) !== 'eq') {
            throw new Error("Only owner can adopt comment");
        }

        // 5. 작품 존재하는지 확인
        const artwork = findArtwork(artworkId);

        // 6. 감상평 존재하는지 확인
        const comment = findComment(commentId);

        // 7. 감상평이 채택되었는지 확인
        if (comment.adopted) {
            throw new Error("Comment already adopted");
        }

        // 8. 감상평 작성자가 소유자인지 확인
        if (comment.owner.compareTo(caller) === 'eq') {
            throw new Error("Comment owner cannot be adopted");
        }

        // 9. 감상평 채택
        comment.adopted = true;

        // 10. 채택 보상 지급
        const fromAccount: typeof Account = {
            owner: ic.id(),
            subaccount: None,
        };

        const toAccount: typeof Account = {
            owner: comment.owner,
            subaccount: None,
        }

        const adoptionReward = await transfer_from({
            from: fromAccount,
            to: toAccount,
            amount: 1n,
            fee: None,
            memo: None,
            created_at_time: None,
        });

        // 11. 감상평 저장
        commentMap.insert(commentId, comment);

        return true;
    }),

    // 16. NFT 정보 조회 (NFT id) -> Opt<Nft> 타입 리턴
    getMyNftList: query([], Vec(Nft), async () => {
        const owner = ic.caller();
        return await getMyNftList(owner);
    }),
});