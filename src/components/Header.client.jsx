import {useEffect, useState, useMemo} from 'react';
import {Link} from '@shopify/hydrogen/client';

import {ConnectionProvider, WalletProvider} from '@solana/wallet-adapter-react';
import {WalletAdapterNetwork} from '@solana/wallet-adapter-base';
import {
  GlowWalletAdapter,
  PhantomWalletAdapter,
  SlopeWalletAdapter,
  SolflareWalletAdapter,
  SolletExtensionWalletAdapter,
  SolletWalletAdapter,
  TorusWalletAdapter,
} from '@solana/wallet-adapter-wallets';
import {
  WalletModalProvider,
  WalletDisconnectButton,
  WalletMultiButton,
} from '@solana/wallet-adapter-react-ui';
import {clusterApiUrl} from '@solana/web3.js';

// Default styles that can be overridden by your app
import '@solana/wallet-adapter-react-ui/styles.css';

import CartToggle from './CartToggle.client';
import {useCartUI} from './CartUIProvider.client';
import CountrySelector from './CountrySelector.client';
import Navigation from './Navigation.client';
import MobileNavigation from './MobileNavigation.client';

import useSolanaWallet from '../hooks/useSolanaWallet';
import environments from '../utils/environments';

const network = environments.NETWORK;

// You can also provide a custom RPC endpoint.
const endpoint = clusterApiUrl(network);

// @solana/wallet-adapter-wallets includes all the adapters but supports tree shaking and lazy loading --
// Only the wallets you configure here will be compiled into your application, and only the dependencies
// of wallets that your users connect to will be loaded.
const wallets = [
  new PhantomWalletAdapter(),
  new GlowWalletAdapter(),
  new SlopeWalletAdapter(),
  new SolflareWalletAdapter({network}),
  new TorusWalletAdapter(),
];

/**
 * A client component that specifies the content of the header on the website
 */
function Header({collections, storeName}) {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [scrollbarWidth, setScrollbarWidth] = useState(0);
  const {isCartOpen} = useCartUI();
  useSolanaWallet();

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
            <div className="flex items-center space-x-2">
              <WalletMultiButton />
              <WalletDisconnectButton />
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

export default function HeaderWrapper(props) {
  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <Header {...props} />
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}
