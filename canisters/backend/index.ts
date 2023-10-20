import {
    bool,
    Canister,
    None,
    Opt,
    query,
    Some,
    StableBTreeMap,
    text,
    update,
    Vec
} from 'azle';
import { Artwork, Comment, Exhibition, Ticket, User } from './types';
import { getCaller } from './utils';

let userMap = StableBTreeMap(text, User, 0);
let exhibitionMap = StableBTreeMap(text, Exhibition, 0);
let artworkMap = StableBTreeMap(text, Artwork, 0);
let ticketMap = StableBTreeMap(text, Ticket, 0);
let commentMap = StableBTreeMap(text, Comment, 0);

export default Canister({
    // 1. 유저 정보 조회 (유저 id) -> Opt<User> 타입 리턴
    getUser: query([text], Opt(User), (id) => {
        return userMap.get(id);
    }),
    // 2. 전시장 정보 조회 (전시장 id) -> Vec<Exhibition> 타입 리턴
    getUserExhibitions: query([text], Vec(Exhibition), (id) => {
        // 1. 유저 존재하는지 확인
        const userOpt = userMap.get(id);
        if ("None" in userOpt) {
            return [];
        }

        const user = userOpt.Some;

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
    // 3. 작품 정보 조회 (작품 id) -> Vec<Artwork> 타입 리턴 
    getUserArtworks: query([text], Vec(Artwork), (id) => {
        // 1. 유저 존재하는지 확인
        const userOpt = userMap.get(id);
        if ("None" in userOpt) {
            return [];
        }

        const user = userOpt.Some;

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
    // 4. 티켓 정보 조회 (티켓 id) -> Vec<Ticket> 타입 리턴
    getUserTickets: query([text], Vec(Ticket), (id) => {
        // 1. 유저 존재하는지 확인
        const userOpt = userMap.get(id);
        if ("None" in userOpt) {
            return [];
        }

        const user = userOpt.Some;

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
    // 5. 감상평 정보 조회 (감상평 id) -> Vec<Comment> 타입 리턴
    getUserComments: query([text], Vec(Comment), (id) => {
        // 1. 유저 존재하는지 확인
        const userOpt = userMap.get(id);
        if ("None" in userOpt) {
            return [];
        }

        const user = userOpt.Some;

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
    // 6. 유저 생성 (이름만 입력) -> bool 타입 리턴
    createUser: update([text], Opt(User), async (name) => {
        // 1. 유저 principal 확인
        const caller = getCaller();

        // 2. 유저가 존재하는지 확인
        if (userMap.containsKey(caller)) {
            return None;
        }

        // 3. 유저 생성
        const user: typeof User = {
            id: caller,
            name,
            exhibitions: [],
            artWorks: [],
            tickets: [],
            comments: [],
        }

        // 4. 유저 저장
        userMap.insert(caller, user);

        return Some(user);
    }),
});