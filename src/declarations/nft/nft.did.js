export const idlFactory = ({ IDL }) => {
  return IDL.Service({
    'getAllNFTList' : IDL.Func(
        [],
        [
          IDL.Vec(
            IDL.Record({
              'id' : IDL.Nat,
              'metaData' : IDL.Record({
                'name' : IDL.Text,
                'description' : IDL.Text,
                'image' : IDL.Vec(IDL.Nat8),
              }),
              'owner' : IDL.Principal,
              'artist' : IDL.Text,
              'price' : IDL.Nat,
              'onSale' : IDL.Bool,
            })
          ),
        ],
        ['query'],
      ),
    'getBalance' : IDL.Func([IDL.Principal], [IDL.Nat16], ['query']),
    'getMyNFTList' : IDL.Func(
        [IDL.Principal],
        [
          IDL.Vec(
            IDL.Record({
              'id' : IDL.Nat,
              'metaData' : IDL.Record({
                'name' : IDL.Text,
                'description' : IDL.Text,
                'image' : IDL.Vec(IDL.Nat8),
              }),
              'owner' : IDL.Principal,
              'artist' : IDL.Text,
              'price' : IDL.Nat,
              'onSale' : IDL.Bool,
            })
          ),
        ],
        ['query'],
      ),
    'mintNFT' : IDL.Func(
        [
          IDL.Principal,
          IDL.Text,
          IDL.Text,
          IDL.Text,
          IDL.Vec(IDL.Nat8),
          IDL.Nat,
        ],
        [IDL.Nat],
        [],
      ),
    'transfer' : IDL.Func([IDL.Principal, IDL.Nat], [IDL.Bool], []),
  });
};
export const init = ({ IDL }) => { return []; };
