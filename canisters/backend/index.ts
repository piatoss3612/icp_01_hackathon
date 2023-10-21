import {
    blob,
    bool,
    Canister,
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
import { generateRandomUUID, getCaller } from './utils';
import { transfer, transfer_from } from './token'
import { mintNFT } from './nft'
import { Account } from 'azle/canisters/icrc';

const BackendCanisterId = Principal.fromText("mxzaz-hqaaa-aaaar-qaada-cai");

// 메모리 내에 저장되는 데이터
let userMap = StableBTreeMap(text, User, 0);
let exhibitionMap = StableBTreeMap(text, Exhibition, 0);
let artworkMap = StableBTreeMap(text, Artwork, 0);
let ticketMap = StableBTreeMap(text, Ticket, 0);
let commentMap = StableBTreeMap(text, Comment, 0);

let exhibitionCost = 10n; // 전시장 생성 비용

const findUser = (id: text) => {
    const userOpt = userMap.get(id);
    if ("None" in userOpt) {
        throw new Error("User not found");
    }

    return userOpt.Some;
}

const findExhibition = (id: text) => {
    const exhibitionOpt = exhibitionMap.get(id);
    if ("None" in exhibitionOpt) {
        throw new Error("Exhibition not found");
    }

    return exhibitionOpt.Some;
}

const findTicket = (id: text) => {
    const ticketOpt = ticketMap.get(id);
    if ("None" in ticketOpt) {
        throw new Error("Ticket not found");
    }

    return ticketOpt.Some;
}

const findArtwork = (id: text) => {
    const artworkOpt = artworkMap.get(id);
    if ("None" in artworkOpt) {
        throw new Error("Artwork not found");
    }

    return artworkOpt.Some;
}

const findComment = (id: text) => {
    const commentOpt = commentMap.get(id);
    if ("None" in commentOpt) {
        throw new Error("Comment not found");
    }

    return commentOpt.Some;
}

export default Canister({
    // 유저 정보 조회 (유저 id) -> Opt<User> 타입 리턴
    getUser: query([text], Opt(User), (id) => {
        return userMap.get(id);
    }),
    // 유저 소유 전시장 정보 조회 (유저 id) -> Vec<Exhibition> 타입 리턴
    getUserExhibitions: query([text], Vec(Exhibition), (id) => {
        // 1. 유저 존재하는지 확인
        const user = findUser(id);

        // 2. 유저가 전시한 전시장들 조회
        const exhibitions: typeof Exhibition[] = [];

        for (let i = 0; i < user.exhibitions.length; i++) {
            const exhibitionOpt = exhibitionMap.get(user.exhibitions[i]);
            if (!("None" in exhibitionOpt)) {
                exhibitions.push(exhibitionOpt.Some);
            }
        }

        return exhibitions;
    }),
    // 유저 소유의 작품 정보 조회 (유저 id) -> Vec<Artwork> 타입 리턴 
    getUserArtworks: query([text], Vec(Artwork), (id) => {
        // 1. 유저 존재하는지 확인
        const user = findUser(id);

        // 2. 유저가 소유한 작품들 조회
        const artworks: typeof Artwork[] = [];

        for (let i = 0; i < user.artWorks.length; i++) {
            const artworkOpt = artworkMap.get(user.artWorks[i]);
            if (!("None" in artworkOpt)) {
                artworks.push(artworkOpt.Some);
            }
        }

        return artworks;
    }),
    // 유저 티켓 정보 조회 (유저 id) -> Vec<Ticket> 타입 리턴
    getUserTickets: query([text], Vec(Ticket), (id) => {
        // 1. 유저 존재하는지 확인
        const user = findUser(id);

        // 2. 유저가 소유한 티켓들 조회
        const tickets: typeof Ticket[] = [];

        for (let i = 0; i < user.tickets.length; i++) {
            const ticketOpt = ticketMap.get(user.tickets[i]);
            if (!("None" in ticketOpt)) {
                tickets.push(ticketOpt.Some);
            }
        }

        return tickets;
    }),
    // 유저 감상평 정보 조회 (유저 id) -> Vec<Comment> 타입 리턴
    getUserComments: query([text], Vec(Comment), (id) => {
        // 1. 유저 존재하는지 확인
        const user = findUser(id);

        // 2. 유저가 작성한 감상평들 조회
        const comments: typeof Comment[] = [];

        for (let i = 0; i < user.tickets.length; i++) {
            const commentOpt = commentMap.get(user.comments[i]);
            if (!("None" in commentOpt)) {
                comments.push(commentOpt.Some);
            }
        }

        return comments;
    }),
    // 6. 유저 생성 (이름만 입력) -> Opt<User> 타입 리턴
    createUser: update([text], Opt(User), (name) => {
        // 1. 유저 principal 확인
        const caller = getCaller();

        // 2. 유저가 존재하는지 확인
        if (userMap.containsKey(caller)) {
            return None;
        }

        // 3. 유저 생성
        const user: typeof User = {
            id: Principal.fromText(caller),
            name: name,
            exhibitions: [],
            artWorks: [],
            tickets: [],
            comments: [],
        }

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
        const exhibitions: typeof Exhibition[] = exhibitionMap.values();
        return exhibitions;
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
        const caller = getCaller();

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
        const ownerAccount: typeof Account = {
            owner: BackendCanisterId,
            subaccount: None,
        };

        const createExhibition = await transfer({
            from_subaccount: None,
            to: ownerAccount,
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
                owner: Principal.fromText(caller),
                price: args.artworks[i].price,
                onSale: args.artworks[i].onSale,
                image: args.artworks[i].image,
                exhibition: exhibitionId,
                comments: [],
            }

            artworks.push(artworkId);
            artworkMap.insert(artworkId, artwork);
        }

        // 7. 전시장 생성
        const exhibition: typeof Exhibition = {
            id: exhibitionId,
            ticketId: ticketId,
            owner: Principal.fromText(caller),
            name: args.name,
            description: args.description,
            artworks: artworks,
            onExhibition: false,
        }

        // 8. 티켓 생성
        const ticket: typeof Ticket = {
            id: ticketId,
            exhibition: exhibition.id,
            price: args.ticketPrice,
            image: args.ticketImage,
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
        const caller = getCaller();

        // 2. 유저가 존재하는지 확인
        findUser(caller);

        // 3. 전시장 존재하는지 확인
        const exhibition = findExhibition(exhibitionId);

        // 4. 전시장이 전시중인지 확인
        if (!exhibition.onExhibition) {
            return false;
        }

        // 5. 전시장 소유자인지 확인
        if (exhibition.owner !== Principal.fromText(caller)) {
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
        const caller = getCaller();

        // 2. 유저가 존재하는지 확인
        const user = findUser(caller);

        // 3. 전시장 존재하는지 확인
        const exhibition = findExhibition(exhibitionId);

        // 4. 티켓 소지 여부 확인
        for (let i = 0; i < user.tickets.length; i++) {
            if (user.tickets[i] === exhibition.ticketId) {
                return true;
            }
        }

        return false;
    }),
    // 티켓 구매 (전시장 id) -> bool 타입 리턴
    buyTicket: update([text], bool, async (exhibitionId) => {
        // 1. 유저 principal 확인
        const caller = getCaller();

        // 2. 유저가 존재하는지 확인
        const user = findUser(caller);

        // 3. 전시장 존재하는지 확인
        const exhibition = findExhibition(exhibitionId);

        // 4. 전시장이 전시중인지 확인
        if (!exhibition.onExhibition) {
            return false;
        }

        // 5. 이미 티켓을 구매했는지 확인
        if (user.tickets.includes(exhibition.ticketId)) {
            return false;
        }

        // 6. 전시장 티켓 가격 확인
        const ticket = findTicket(exhibition.ticketId);

        // 7. 티켓 구매
        // caller가 ticket.price 만큼의 ICX를 exhibition owner에게 전송
        const exhibitionOwnerAccount: typeof Account = {
            owner: exhibition.owner,
            subaccount: None,
        }
        const buyTicket = await transfer({
            from_subaccount: None,
            to: exhibitionOwnerAccount,
            amount: ticket.price,
            fee: None,
            memo: None,
            created_at_time: None,
        });

        // 7-2. 티켓 NFT mint
        const nftId = mintNFT(Principal.fromText(caller), exhibition.name, exhibition.description,
            exhibition.owner.toText(), ticket.image, ticket.price);

        // 8. 티켓 저장
        user.tickets.push(ticket.id);

        // 9. 유저 저장
        userMap.insert(caller, user);

        return true;
    }),
    // 작품 구매 (전시장 id, 작품 id) -> bool 타입 리턴
    buyArtwork: update([text, text], bool, async (exhibitionId, artworkId) => {
        // 1. 유저 principal 확인
        const caller = getCaller();

        // 2. 유저가 존재하는지 확인
        const user = findUser(caller);

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

        // 7. 작품 가격 확인
        const price = artwork.price;

        // 8. 작품 구매
        const exhibitionOwnerAccount: typeof Account = {
            owner: exhibition.owner,
            subaccount: None,
        }

        // 8-1. 작품 가격만큼의 ICX를 artwork.owner에게 전송
        const buyArtwork = await transfer({
            from_subaccount: None,
            to: exhibitionOwnerAccount,
            amount: price,
            fee: None,
            memo: None,
            created_at_time: None,
        });

        // 8-2. 작품 NFT mint       
        const nftId = await mintNFT(Principal.fromText(caller), artwork.name, artwork.description,
            exhibition.owner.toText(), artwork.image, price);

        artwork.onSale = false;

        // 9. 작품 저장
        artworkMap.insert(artworkId, artwork);
        user.artWorks.push(artwork.id);

        // 10. 유저 저장
        userMap.insert(caller, user);

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
        const caller = getCaller();

        // 2. 유저가 존재하는지 확인
        const user = findUser(caller);

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
            owner: Principal.fromText(caller),
            exhibition: exhibition.id,
            content: content,
            adopted: false,
        }

        // 8. 감상평 저장
        artwork.comments.push(commentId);
        artworkMap.insert(artworkId, artwork);
        commentMap.insert(commentId, comment);

        // 9. 유저 저장
        user.comments.push(comment.id);
        userMap.insert(caller, user);

        return true;
    }),
    // 15. 감상평 채택 (전시장 id, 작품 id, 감상평 id) -> bool 타입 리턴
    adoptComment: update([text, text, text, nat], bool, async (exhibitionId, artworkId, commentId, reward) => {
        // 1. 유저 principal 확인
        const caller = getCaller();

        // 2. 유저가 존재하는지 확인
        const user = findUser(caller);

        // 3. 전시장 존재하는지 확인
        const exhibition = findExhibition(exhibitionId);

        // 4. 전시장의 소유자인지 확인 
        if (exhibition.owner !== Principal.fromText(caller)) {
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
        if (comment.owner === Principal.fromText(caller)) {
            throw new Error("Comment owner cannot be adopted");
        }

        // 9. 감상평 채택
        comment.adopted = true;

        // 10. 채택 보상 지급
        const fromAccount: typeof Account = {
            owner: Principal.fromText(caller),
            subaccount: None,
        };

        const toAccount: typeof Account = {
            owner: comment.owner,
            subaccount: None,
        }

        const adoptionReward = await transfer_from({
            from: fromAccount,
            to: toAccount,
            amount: reward,
            fee: None,
            memo: None,
            created_at_time: None,
        });

        // 11. 감상평 저장
        commentMap.insert(commentId, comment);

        return true;
    }),
});