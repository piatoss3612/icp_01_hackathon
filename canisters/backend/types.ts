import { Record, Vec, bool, nat, text, blob } from 'azle';

// 감상평
const Comment = Record({
    id: text, // 감상평 id
    owner: text, // 감상평 작성자
    exhibition: text, // 감상평이 속한 전시장 id
    content: text, // 감상평 내용
    adopted: bool, // 감상평이 채택되었는지
})

// 작품
const Artwork = Record({
    id: text, // 작품 id
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
    ticketId: text, // 전시장 티켓 id
    owner: text, // 전시장 소유자
    name: text, // 전시장 이름
    description: text, // 전시장 설명
    artworks: Vec(Artwork), // 전시장에 속한 작품들 (개수 제한 최대 5)
    onExhibition: bool, // 전시장이 전시중인지
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

export {
    Comment,
    Artwork,
    Ticket,
    Exhibition,
    User,
}