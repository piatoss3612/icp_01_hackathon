import { Principal } from '@dfinity/principal';

interface Ticket {
    id: string;
    image: Uint8Array | number[];
    price: bigint;
    exhibition: string;
}

interface Exhibition {
    id: string;
    ticket: Ticket;
    owner: Principal;
    name: string;
    description: string;
    artworks: Array<string>;
    ticketHolders: Array<Principal>;
    onExhibition: boolean;
}

interface Nft {
    id: bigint;
    metaData: {
        name: string;
        description: string;
        image: Uint8Array | number[];
    };
    owner: Principal;
    artist: string;
    price: bigint;
    onSale: boolean;
}

export type { Ticket, Exhibition, Nft };