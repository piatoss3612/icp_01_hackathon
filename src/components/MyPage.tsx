import React, { useState, useContext, useEffect } from 'react';
import { useRouter } from 'next/router';
import * as M from '../styles/MyPage.styles';
import { CanisterContext } from '../context/canister';
import { Nft } from '../types';
import * as T from '../styles/Ticket.styles';
import Image from 'next/image';
import { DefaultImg } from './Common/Reference';

const MyPage = () => {
  const [activeTab, setActiveTab] = useState<string>('mynfts');
  const [nfts, setNfts] = useState<Nft[]>([]);
  const [balance, setBalance] = useState<bigint>(0n);


  const { principal, isAuthenticated, backendActor, ledgerActor } = useContext(CanisterContext);
  const router = useRouter();

  useEffect(() => {
    if (!principal || principal.isAnonymous()) {
      return;
    }

    if (!isAuthenticated) return;
    if (!backendActor) return;
    if (!ledgerActor) return;

    const getProfile = async () => {
      const balance = await ledgerActor.icrc1_balance_of({
        owner: principal,
        subaccount: [],
      });

      console.log('Balance: ', balance);
      setBalance(balance);

      const nfts = await backendActor.getMyNftList();

      console.log('NFTs: ', nfts);
      setNfts(nfts);
    }

    try {
      getProfile()
    } catch (err) {
      console.log(err);
    }
  }, [principal, isAuthenticated, backendActor, ledgerActor]);


  if (!principal || principal.isAnonymous()) {
    return null;
  }

  return (
    <M.MyPageContainer>
      <M.ProfileContainer>
        <p></p>
        <M.InfoContainer>
          <p title='Click to copy the principal'>{principal?.toText().slice(0, 5) + '...' + principal?.toText().slice(principal?.toText().length - 5, principal?.toText().length)}</p>
          <p>{balance.toString()} CT</p>
        </M.InfoContainer>
      </M.ProfileContainer>
      <M.TabContainer>
        <M.TabButton
          className={activeTab === 'mynfts' ? 'active' : ''}
          onClick={() => setActiveTab('mynfts')}
        >
          My NFTs
        </M.TabButton>
      </M.TabContainer>
      <T.CardContainer>
        {
          nfts.map((nft) => {
            const blob = new Blob([new Uint8Array(nft.metaData.image)]);
            const url = URL.createObjectURL(blob);

            return <T.Card key={nft.id}>
              <T.CardImgContainer>
                <Image src={url || DefaultImg} alt="poster" fill quality={100} priority />
              </T.CardImgContainer>
              <T.CardContent>
                <h2>{nft.metaData.name}</h2>
                <p>{nft.metaData.description}</p>
              </T.CardContent>
            </T.Card>
          })
        }
      </T.CardContainer>
    </M.MyPageContainer>
  )
}

export default MyPage;