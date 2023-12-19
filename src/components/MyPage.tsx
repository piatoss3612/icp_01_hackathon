import React, { useState, useContext, useEffect } from 'react';
import { useRouter } from 'next/router';
import * as M from '../styles/MyPage.styles';
import { CanisterContext } from '../context/canister';

const MyPage = () => {
  const [activeTab, setActiveTab] = useState<string>('mynfts');
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

    const getBalance = async () => {
      const balance = await ledgerActor.icrc1_balance_of({
        owner: principal,
        subaccount: [],
      });

      console.log('Balance: ', balance);
      setBalance(balance);
    }

    try {
      getBalance()
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
    </M.MyPageContainer>
  )
}

export default MyPage;