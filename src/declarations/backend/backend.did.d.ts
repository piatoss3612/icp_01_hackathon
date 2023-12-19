import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';

export interface _SERVICE {
  'adoptComment' : ActorMethod<[string, string, string, bigint], boolean>,
  'buyArtwork' : ActorMethod<[string, string], boolean>,
  'buyTicket' : ActorMethod<[string], boolean>,
  'closeExhibition' : ActorMethod<[string], boolean>,
  'createExhibition' : ActorMethod<
    [
      {
        'name' : string,
        'description' : string,
        'artworks' : Array<
          {
            'name' : string,
            'description' : string,
            'image' : Uint8Array | number[],
            'price' : bigint,
            'onSale' : boolean,
          }
        >,
        'ticketImage' : Uint8Array | number[],
        'ticketPrice' : bigint,
      },
    ],
    string
  >,
  'createUser' : ActorMethod<[], [] | [{ 'id' : Principal }]>,
  'getArtwork' : ActorMethod<
    [string],
    [] | [
      {
        'id' : string,
        'owner' : Principal,
        'name' : string,
        'description' : string,
        'image' : Uint8Array | number[],
        'comments' : Array<string>,
        'price' : bigint,
        'onSale' : boolean,
        'exhibition' : string,
      }
    ]
  >,
  'getArtworks' : ActorMethod<
    [string],
    Array<
      {
        'id' : string,
        'owner' : Principal,
        'name' : string,
        'description' : string,
        'image' : Uint8Array | number[],
        'comments' : Array<string>,
        'price' : bigint,
        'onSale' : boolean,
        'exhibition' : string,
      }
    >
  >,
  'getComments' : ActorMethod<
    [string],
    Array<
      {
        'id' : string,
        'content' : string,
        'owner' : Principal,
        'adopted' : boolean,
        'exhibition' : string,
      }
    >
  >,
  'getExhibition' : ActorMethod<
    [string],
    [] | [
      {
        'id' : string,
        'ticket' : {
          'id' : string,
          'image' : Uint8Array | number[],
          'price' : bigint,
          'exhibition' : string,
        },
        'owner' : Principal,
        'name' : string,
        'description' : string,
        'artworks' : Array<string>,
        'ticketHolders' : Array<Principal>,
        'onExhibition' : boolean,
      }
    ]
  >,
  'getExhibitionCost' : ActorMethod<[], bigint>,
  'getExhibitions' : ActorMethod<
    [],
    Array<
      {
        'id' : string,
        'ticket' : {
          'id' : string,
          'image' : Uint8Array | number[],
          'price' : bigint,
          'exhibition' : string,
        },
        'owner' : Principal,
        'name' : string,
        'description' : string,
        'artworks' : Array<string>,
        'ticketHolders' : Array<Principal>,
        'onExhibition' : boolean,
      }
    >
  >,
  'getMyNftList' : ActorMethod<
    [],
    Array<
      {
        'id' : bigint,
        'metaData' : {
          'name' : string,
          'description' : string,
          'image' : Uint8Array | number[],
        },
        'owner' : Principal,
        'artist' : string,
        'price' : bigint,
        'onSale' : boolean,
      }
    >
  >,
  'getTicket' : ActorMethod<
    [string],
    [] | [
      {
        'id' : string,
        'image' : Uint8Array | number[],
        'price' : bigint,
        'exhibition' : string,
      }
    ]
  >,
  'getUser' : ActorMethod<[Principal], [] | [{ 'id' : Principal }]>,
  'hasTicket' : ActorMethod<[string], boolean>,
  'writeComment' : ActorMethod<[string, string, string], boolean>,
}
