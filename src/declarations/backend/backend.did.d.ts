import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';

export interface _SERVICE {
  'adoptComment' : ActorMethod<[string, string, string], boolean>,
  'buyArtwork' : ActorMethod<[string, string], boolean>,
  'buyTicket' : ActorMethod<[string], boolean>,
  'closeExhibition' : ActorMethod<[string], boolean>,
  'createExhibition' : ActorMethod<
    [
      string,
      string,
      Array<
        {
          'id' : string,
          'owner' : string,
          'name' : string,
          'description' : string,
          'image' : Uint8Array | number[],
          'comments' : Array<
            {
              'id' : string,
              'content' : string,
              'owner' : string,
              'adopted' : boolean,
              'exhibition' : string,
            }
          >,
          'price' : bigint,
          'onSale' : boolean,
          'exhibition' : string,
        }
      >,
      bigint,
      Uint8Array | number[],
    ],
    string
  >,
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
  'getArtwork' : ActorMethod<
    [string],
    [] | [
      {
        'id' : string,
        'owner' : string,
        'name' : string,
        'description' : string,
        'image' : Uint8Array | number[],
        'comments' : Array<
          {
            'id' : string,
            'content' : string,
            'owner' : string,
            'adopted' : boolean,
            'exhibition' : string,
          }
        >,
        'price' : bigint,
        'onSale' : boolean,
        'exhibition' : string,
      }
    ]
  >,
  'getExhibition' : ActorMethod<
    [string],
    [] | [
      {
        'id' : string,
        'owner' : string,
        'name' : string,
        'description' : string,
        'artworks' : Array<
          {
            'id' : string,
            'owner' : string,
            'name' : string,
            'description' : string,
            'image' : Uint8Array | number[],
            'comments' : Array<
              {
                'id' : string,
                'content' : string,
                'owner' : string,
                'adopted' : boolean,
                'exhibition' : string,
              }
            >,
            'price' : bigint,
            'onSale' : boolean,
            'exhibition' : string,
          }
        >,
        'ticketId' : string,
        'onExhibition' : boolean,
      }
    ]
  >,
  'getExhibitionCost' : ActorMethod<[], bigint>,
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
  'getTokenName' : ActorMethod<[], string>,
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
        'id' : string,
        'owner' : string,
        'name' : string,
        'description' : string,
        'image' : Uint8Array | number[],
        'comments' : Array<
          {
            'id' : string,
            'content' : string,
            'owner' : string,
            'adopted' : boolean,
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
        'id' : string,
        'content' : string,
        'owner' : string,
        'adopted' : boolean,
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
            'id' : string,
            'owner' : string,
            'name' : string,
            'description' : string,
            'image' : Uint8Array | number[],
            'comments' : Array<
              {
                'id' : string,
                'content' : string,
                'owner' : string,
                'adopted' : boolean,
                'exhibition' : string,
              }
            >,
            'price' : bigint,
            'onSale' : boolean,
            'exhibition' : string,
          }
        >,
        'ticketId' : string,
        'onExhibition' : boolean,
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
  'hasTicket' : ActorMethod<[string], boolean>,
  'writeComment' : ActorMethod<[string, string, string], boolean>,
}
