import { Record, Vec, bool, nat, text, blob } from 'azle';
import { getCaller } from './utils';

// 감상평
const Comment = Record({
    owner: text, // 감상평 작성자
    exhibition: text, // 감상평이 속한 전시장 id
    content: text, // 감상평 내용
    adapted: bool, // 감상평이 채택되었는지
})

// 작품
const Artwork = Record({
    name: text, // 작품 이름
    description: text, // 작품 설명
    owner: text, // 작품 소유자
    price: nat, // 작품 가격
    onSale: bool, // 작품이 판매중인지
    image: blob, // 작품 이미지 (Blob)
    exhibition: text, // 작품이 속한 전시장 id
    comments: Vec(Comment), // 작품에 달린 감상평들
})

// 티켓
const Ticket = Record({
    id: text, // 티켓 id
    exhibition: text, // 티켓이 속한 전시장 id
    price: nat, // 티켓 가격
    image: blob, // 티켓 이미지
})

// 전시장
const Exhibition = Record({
    id: text, // 전시장 id
    owner: text, // 전시장 소유자
    name: text, // 전시장 이름
    description: text, // 전시장 설명
    artworks: Vec(Artwork), // 전시장에 속한 작품들 (개수 제한 최대 5)
    onExhibition: bool, // 전시장이 전시중인지
    ticketPrice: nat, // 전시장의 티켓 가격
    ticketImage: blob, // 전시장의 티켓 이미지
})

// 유저
const User = Record({
    id: text, // 유저의 고유 식별자
    name: text, // 유저의 이름
    exhibitions: Vec(text), // 유저가 전시한 전시장들 (전시장 id)
    artWorks: Vec(text), // 유저가 소유한 작품들 (작품 id)
    tickets: Vec(text), // 유저가 소유한 티켓들 (티켓 id)
    comments: Vec(text), // 유저가 작성한 감상평들 (감상평 id)
})

// 함수 정의


// 2. 전시장 생성 (이름, 설명, 작품들, 티켓 가격, 티켓 이미지)
const createExhibition = async (name: text, description: text, artworks: Vec<typeof Artwork>, ticketPrice: nat, ticketImage: text) => {
    // 1. 유저 principal 확인
    const caller = getCaller();

    // 2. 유저가 존재하는지 확인

    // 3. 전시장 생성 비용 확인

    // 4. 파라미터 유효성 검사

    // 5. 전시장 생성

    return null;
};

// 3. 티켓 구매 (전시장 id)
const buyTicket = async (exhibitionId: text) => {
    // 1. 유저 principal 확인
    const caller = getCaller();

    // 2. 유저가 존재하는지 확인

    // 3. 전시장 존재하는지 확인

    // 4. 전시장이 전시중인지 확인

    // 5. 이미 티켓을 구매했는지 확인

    // 6. 전시장 티켓 가격 확인 

    // 7. 잔액 확인

    // 7. 티켓 구매
    return null;
};

// 4. 작품 구매 (전시장 id, 작품 id)
const buyArtwork = async (exhibitionId: text, artworkId: text) => {
    // 1. 유저 principal 확인

    // 2. 유저가 존재하는지 확인

    // 3. 전시장 존재하는지 확인

    // 4. 전시장이 전시중인지 확인

    // 5. 작품 존재하는지 확인

    // 6. 작품이 판매중인지 확인

    // 7. 작품 가격 확인

    // 8. 잔액 확인

    // 9. 작품 구매
    return null;
};

// 5. 감상평 작성 (전시장 id, 작품 id, 감상평 내용)
const writeComment = async (exhibitionId: text, artworkId: text, content: text) => {
    // 1. 유저 principal 확인

    // 2. 유저가 존재하는지 확인

    // 3. 전시장 존재하는지 확인

    // 4. 전시장이 전시중인지 확인

    // 5. 작품 존재하는지 확인

    // 6. 작품이 판매중인지 확인

    // 7. 감상평 작성
    return null;
};

// 6. 감상평 채택 (전시장 id, 작품 id, 감상평 id)
const adoptComment = async (exhibitionId: text, artworkId: text, commentId: text) => {
    // 1. 유저 principal 확인

    // 2. 유저가 존재하는지 확인

    // 3. 전시장 존재하는지 확인

    // 4. 전시장이 전시중인지 확인

    // 5. 작품 존재하는지 확인

    // 6. 작품이 판매중인지 확인

    // 7. 감상평 존재하는지 확인

    // 8. 감상평이 채택되었는지 확인

    // 9. 감상평 작성자가 전시장 소유자인지 확인

    // 10. 감상평 채택
    return null;
};

// 7. 전시 마감 (전시장 id)
const closeExhibition = async (exhibitionId: text) => {
    // 1. 유저 principal 확인

    // 2. 유저가 존재하는지 확인

    // 3. 전시장 존재하는지 확인

    // 4. 전시장이 전시중인지 확인

    // 5. 전시장 소유자인지 확인

    // 6. 전시 마감
    return null;
};


// 14. 전시장의 감상평 목록 조회 (전시장 id)
const getUserComments = async (userId: text) => {
    // 1. 유저 principal 확인

    // 2. 유저 존재하는지 확인

    // 3. 감상평 목록 조회
    return null;
}

export {
    Comment,
    Artwork,
    Ticket,
    Exhibition,
    User,
    createExhibition,
    buyTicket,
    buyArtwork,
    writeComment,
    adoptComment,
    closeExhibition
}