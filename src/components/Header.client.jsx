import {useEffect, useState} from 'react';
import {Link, useNavigate} from '@shopify/hydrogen/client';
import {MoralisProvider} from 'react-moralis';

import CartToggle from './CartToggle.client';
import {useCartUI} from './CartUIProvider.client';
import CountrySelector from './CountrySelector.client';
import Navigation from './Navigation.client';
import MobileNavigation from './MobileNavigation.client';
import LogoutBtn from './LogoutBtn.client';
import LoginBtn from './LoginBtn';
import useAccount from '../hooks/useAccount';

const appId = 'mKu4P0mSPKHy23MV7IzqCdRxZIMbEvcKlbQE56d7';
const serverUrl = 'https://6zitu24v62ou.usemoralis.com:2053/server';

/**
 * A client component that specifies the content of the header on the website
 */
function Header({collections, storeName}) {
  const navigate = useNavigate();
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [scrollbarWidth, setScrollbarWidth] = useState(0);
  const {isCartOpen} = useCartUI();
  const {
    isAuthenticated,
    account,
    user,
    balance,
    connectMetamaskWallet,
    logOut,
  } = useAccount();

  // console.log({account, user, balance});

  useEffect(() => {
    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth;

    setScrollbarWidth(scrollbarWidth);
  }, [isCartOpen]);

  return (
    <header className="h-20 lg:h-32" role="banner">
      <div
        className={`fixed z-20 h-20 lg:h-32 w-full border-b border-gray-200 px-6 md:px-8 md:py-6 lg:pt-8 lg:pb-0 mx-auto bg-white ${
          isMobileNavOpen ? '' : 'bg-opacity-95'
        }`}
      >
        <div
          className="h-full flex lg:flex-col place-content-between"
          style={{
            paddingRight: isCartOpen ? scrollbarWidth : 0,
          }}
        >
          <div className="text-center w-full flex justify-between items-center">
            <CountrySelector />
            <MobileNavigation
              collections={collections}
              isOpen={isMobileNavOpen}
              setIsOpen={setIsMobileNavOpen}
            />
            <Link
              className="font-black uppercase text-3xl tracking-widest"
              to="/"
            >
              {storeName}
            </Link>
            <div className="flex items-center">
              {isAuthenticated ? (
                <LogoutBtn
                  onClick={() => {
                    console.log('Logout');
                    logOut();
                  }}
                />
              ) : (
                <LoginBtn onClick={connectMetamaskWallet} />
              )}
              <CartToggle
                handleClick={() => {
                  if (isMobileNavOpen) setIsMobileNavOpen(false);
                }}
              />
            </div>
          </div>
          <Navigation collections={collections} storeName={storeName} />
        </div>
      </div>
    </header>
  );
}

export default (props) => (
  <MoralisProvider appId={appId} serverUrl={serverUrl}>
    <Header {...props} />
  </MoralisProvider>
);
