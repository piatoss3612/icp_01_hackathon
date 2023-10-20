import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';

export interface _SERVICE {
  'createUser' : ActorMethod<
    [string],
    [] | [
      {
        'id' : string,
        'exhibitions' : Array<string>,
        'tickets' : Array<string>,
        'name' : string,
        'comments' : Array<string>,
        'artWorks' : Array<string>,
      }
    ]
  >,
  'getUser' : ActorMethod<
    [string],
    [] | [
      {
        'id' : string,
        'exhibitions' : Array<string>,
        'tickets' : Array<string>,
        'name' : string,
        'comments' : Array<string>,
        'artWorks' : Array<string>,
      }
    ]
  >,
  'getUserArtworks' : ActorMethod<
    [string],
    Array<
      {
        'owner' : string,
        'name' : string,
        'description' : string,
        'image' : Uint8Array | number[],
        'comments' : Array<
          {
            'content' : string,
            'owner' : string,
            'adapted' : boolean,
            'exhibition' : string,
          }
        >,
        'price' : bigint,
        'onSale' : boolean,
        'exhibition' : string,
      }
    >
  >,
  'getUserComments' : ActorMethod<
    [string],
    Array<
      {
        'content' : string,
        'owner' : string,
        'adapted' : boolean,
        'exhibition' : string,
      }
    >
  >,
  'getUserExhibitions' : ActorMethod<
    [string],
    Array<
      {
        'id' : string,
        'owner' : string,
        'name' : string,
        'description' : string,
        'artworks' : Array<
          {
            'owner' : string,
            'name' : string,
            'description' : string,
            'image' : Uint8Array | number[],
            'comments' : Array<
              {
                'content' : string,
                'owner' : string,
                'adapted' : boolean,
                'exhibition' : string,
              }
            >,
            'price' : bigint,
            'onSale' : boolean,
            'exhibition' : string,
          }
        >,
        'onExhibition' : boolean,
        'ticketImage' : Uint8Array | number[],
        'ticketPrice' : bigint,
      }
    >
  >,
  'getUserTickets' : ActorMethod<
    [string],
    Array<
      {
        'id' : string,
        'image' : Uint8Array | number[],
        'price' : bigint,
        'exhibition' : string,
      }
    >
  >,
}
