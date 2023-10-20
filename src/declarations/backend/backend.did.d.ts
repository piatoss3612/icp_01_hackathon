import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';

export interface _SERVICE {
  'http_request' : ActorMethod<
    [
      {
        'url' : string,
        'method' : string,
        'body' : Uint8Array | number[],
        'headers' : Array<[string, string]>,
        'certificate_version' : [] | [number],
      },
    ],
    {
      'body' : Uint8Array | number[],
      'headers' : Array<[string, string]>,
      'upgrade' : [] | [boolean],
      'streaming_strategy' : [] | [
        {
            'Callback' : {
              'token' : { 'arbitrary_data' : string },
              'callback' : [Principal, string],
            }
          }
      ],
      'status_code' : number,
    }
  >,
}
