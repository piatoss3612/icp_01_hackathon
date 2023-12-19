import React, { useState, useRef, useContext } from 'react';
import Image from 'next/image'
import Link from 'next/link';
import * as H from '../../styles/Header.styles';
import { CanisterContext } from '../../context/canister';


const Header = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const { principal, login, logout } = useContext(CanisterContext);

  const dropdownRef = useRef<any>(null);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <H.Head>
      <Link href='/'>
        {/* <Image src={Logo} alt='logo' width={150} height={25} quality={100} /> */}
      </Link>
      <div>
        <H.Menu>
          <li>
            <Link href='/'>About us</Link>
          </li>
          <li>
            <Link href='/explore'>Explore</Link>
          </li>
          <li>
            {principal && !principal.isAnonymous() ? (<H.ProfileContainer>
              <H.DropdownButtonContainer ref={dropdownRef}>
                <H.ProfileButton onClick={toggleDropdown} type='button'>
                  {`${principal.toText().slice(0, 5)}...${principal.toText().slice(
                    principal.toText().length - 5,
                    principal.toText().length,
                  )} ${isDropdownOpen ? '▲' : '▼'}`}
                </H.ProfileButton>
                {isDropdownOpen && (
                  <H.DropdownContainer className={isDropdownOpen ? 'open' : ''}>
                    <>
                      <Link href={`/mypage`}>
                        MyPage
                      </Link>
                      <Link href={`/create`}>
                        Create Exhibition
                      </Link>
                    </>
                    <span onClick={logout}>Logout</span>
                  </H.DropdownContainer>
                )}
              </H.DropdownButtonContainer>
            </H.ProfileContainer>) : (<H.LoginBtn onClick={login}>Connect</H.LoginBtn>)}
          </li>
        </H.Menu>
      </div>
    </H.Head>
  )
}

export default Header;
