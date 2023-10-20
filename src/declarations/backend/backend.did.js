export const idlFactory = ({ IDL }) => {
  return IDL.Service({
    'createUser' : IDL.Func(
        [IDL.Text],
        [
          IDL.Opt(
            IDL.Record({
              'id' : IDL.Text,
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
    'getUser' : IDL.Func(
        [IDL.Text],
        [
          IDL.Opt(
            IDL.Record({
              'id' : IDL.Text,
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
              'owner' : IDL.Text,
              'name' : IDL.Text,
              'description' : IDL.Text,
              'image' : IDL.Vec(IDL.Nat8),
              'comments' : IDL.Vec(
                IDL.Record({
                  'content' : IDL.Text,
                  'owner' : IDL.Text,
                  'adapted' : IDL.Bool,
                  'exhibition' : IDL.Text,
                })
              ),
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
              'content' : IDL.Text,
              'owner' : IDL.Text,
              'adapted' : IDL.Bool,
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
              'owner' : IDL.Text,
              'name' : IDL.Text,
              'description' : IDL.Text,
              'artworks' : IDL.Vec(
                IDL.Record({
                  'owner' : IDL.Text,
                  'name' : IDL.Text,
                  'description' : IDL.Text,
                  'image' : IDL.Vec(IDL.Nat8),
                  'comments' : IDL.Vec(
                    IDL.Record({
                      'content' : IDL.Text,
                      'owner' : IDL.Text,
                      'adapted' : IDL.Bool,
                      'exhibition' : IDL.Text,
                    })
                  ),
                  'price' : IDL.Nat,
                  'onSale' : IDL.Bool,
                  'exhibition' : IDL.Text,
                })
              ),
              'onExhibition' : IDL.Bool,
              'ticketImage' : IDL.Vec(IDL.Nat8),
              'ticketPrice' : IDL.Nat,
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
  });
};
export const init = ({ IDL }) => { return []; };
