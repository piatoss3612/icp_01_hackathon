export const idlFactory = ({ IDL }) => {
  return IDL.Service({
    'adoptComment' : IDL.Func(
        [IDL.Text, IDL.Text, IDL.Text, IDL.Nat],
        [IDL.Bool],
        [],
      ),
    'buyArtwork' : IDL.Func([IDL.Text, IDL.Text], [IDL.Bool], []),
    'buyTicket' : IDL.Func([IDL.Text], [IDL.Bool], []),
    'closeExhibition' : IDL.Func([IDL.Text], [IDL.Bool], []),
    'createExhibition' : IDL.Func(
        [
          IDL.Record({
            'name' : IDL.Text,
            'description' : IDL.Text,
            'artworks' : IDL.Vec(
              IDL.Record({
                'name' : IDL.Text,
                'description' : IDL.Text,
                'image' : IDL.Vec(IDL.Nat8),
                'price' : IDL.Nat,
                'onSale' : IDL.Bool,
              })
            ),
            'ticketImage' : IDL.Vec(IDL.Nat8),
            'ticketPrice' : IDL.Nat,
          }),
        ],
        [IDL.Text],
        [],
      ),
    'createUser' : IDL.Func(
        [IDL.Text],
        [
          IDL.Opt(
            IDL.Record({
              'id' : IDL.Principal,
              'exhibitions' : IDL.Vec(IDL.Text),
              'tickets' : IDL.Vec(IDL.Text),
              'name' : IDL.Text,
              'comments' : IDL.Vec(IDL.Text),
              'artWorks' : IDL.Vec(IDL.Text),
            })
          ),
        ],
        [],
      ),
    'getArtwork' : IDL.Func(
        [IDL.Text],
        [
          IDL.Opt(
            IDL.Record({
              'id' : IDL.Text,
              'owner' : IDL.Principal,
              'name' : IDL.Text,
              'description' : IDL.Text,
              'image' : IDL.Vec(IDL.Nat8),
              'comments' : IDL.Vec(IDL.Text),
              'price' : IDL.Nat,
              'onSale' : IDL.Bool,
              'exhibition' : IDL.Text,
            })
          ),
        ],
        ['query'],
      ),
    'getArtworks' : IDL.Func(
        [IDL.Text],
        [
          IDL.Vec(
            IDL.Record({
              'id' : IDL.Text,
              'owner' : IDL.Principal,
              'name' : IDL.Text,
              'description' : IDL.Text,
              'image' : IDL.Vec(IDL.Nat8),
              'comments' : IDL.Vec(IDL.Text),
              'price' : IDL.Nat,
              'onSale' : IDL.Bool,
              'exhibition' : IDL.Text,
            })
          ),
        ],
        ['query'],
      ),
    'getComments' : IDL.Func(
        [IDL.Text],
        [
          IDL.Vec(
            IDL.Record({
              'id' : IDL.Text,
              'content' : IDL.Text,
              'owner' : IDL.Principal,
              'adopted' : IDL.Bool,
              'exhibition' : IDL.Text,
            })
          ),
        ],
        ['query'],
      ),
    'getExhibition' : IDL.Func(
        [IDL.Text],
        [
          IDL.Opt(
            IDL.Record({
              'id' : IDL.Text,
              'owner' : IDL.Principal,
              'name' : IDL.Text,
              'description' : IDL.Text,
              'artworks' : IDL.Vec(IDL.Text),
              'ticketId' : IDL.Text,
              'onExhibition' : IDL.Bool,
            })
          ),
        ],
        ['query'],
      ),
    'getExhibitionCost' : IDL.Func([], [IDL.Nat], ['query']),
    'getExhibitions' : IDL.Func(
        [],
        [
          IDL.Vec(
            IDL.Record({
              'id' : IDL.Text,
              'owner' : IDL.Principal,
              'name' : IDL.Text,
              'description' : IDL.Text,
              'artworks' : IDL.Vec(IDL.Text),
              'ticketId' : IDL.Text,
              'onExhibition' : IDL.Bool,
            })
          ),
        ],
        ['query'],
      ),
    'getTicket' : IDL.Func(
        [IDL.Text],
        [
          IDL.Opt(
            IDL.Record({
              'id' : IDL.Text,
              'image' : IDL.Vec(IDL.Nat8),
              'price' : IDL.Nat,
              'exhibition' : IDL.Text,
            })
          ),
        ],
        ['query'],
      ),
    'getUser' : IDL.Func(
        [IDL.Text],
        [
          IDL.Opt(
            IDL.Record({
              'id' : IDL.Principal,
              'exhibitions' : IDL.Vec(IDL.Text),
              'tickets' : IDL.Vec(IDL.Text),
              'name' : IDL.Text,
              'comments' : IDL.Vec(IDL.Text),
              'artWorks' : IDL.Vec(IDL.Text),
            })
          ),
        ],
        ['query'],
      ),
    'getUserArtworks' : IDL.Func(
        [IDL.Text],
        [
          IDL.Vec(
            IDL.Record({
              'id' : IDL.Text,
              'owner' : IDL.Principal,
              'name' : IDL.Text,
              'description' : IDL.Text,
              'image' : IDL.Vec(IDL.Nat8),
              'comments' : IDL.Vec(IDL.Text),
              'price' : IDL.Nat,
              'onSale' : IDL.Bool,
              'exhibition' : IDL.Text,
            })
          ),
        ],
        ['query'],
      ),
    'getUserComments' : IDL.Func(
        [IDL.Text],
        [
          IDL.Vec(
            IDL.Record({
              'id' : IDL.Text,
              'content' : IDL.Text,
              'owner' : IDL.Principal,
              'adopted' : IDL.Bool,
              'exhibition' : IDL.Text,
            })
          ),
        ],
        ['query'],
      ),
    'getUserExhibitions' : IDL.Func(
        [IDL.Text],
        [
          IDL.Vec(
            IDL.Record({
              'id' : IDL.Text,
              'owner' : IDL.Principal,
              'name' : IDL.Text,
              'description' : IDL.Text,
              'artworks' : IDL.Vec(IDL.Text),
              'ticketId' : IDL.Text,
              'onExhibition' : IDL.Bool,
            })
          ),
        ],
        ['query'],
      ),
    'getUserTickets' : IDL.Func(
        [IDL.Text],
        [
          IDL.Vec(
            IDL.Record({
              'id' : IDL.Text,
              'image' : IDL.Vec(IDL.Nat8),
              'price' : IDL.Nat,
              'exhibition' : IDL.Text,
            })
          ),
        ],
        ['query'],
      ),
    'hasTicket' : IDL.Func([IDL.Text], [IDL.Bool], ['query']),
    'writeComment' : IDL.Func([IDL.Text, IDL.Text, IDL.Text], [IDL.Bool], []),
  });
};
export const init = ({ IDL }) => { return []; };
