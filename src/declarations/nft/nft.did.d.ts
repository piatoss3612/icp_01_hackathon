import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';

export interface _SERVICE {
  'getAllNFTList' : ActorMethod<
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
  'getBalance' : ActorMethod<[Principal], number>,
  'getMyNFTList' : ActorMethod<
    [Principal],
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
  'mintNFT' : ActorMethod<
    [Principal, string, string, string, Uint8Array | number[], bigint],
    bigint
  >,
  'transfer' : ActorMethod<[Principal, bigint], boolean>,
}
