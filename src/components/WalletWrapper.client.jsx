import {ConnectionProvider, WalletProvider} from '@solana/wallet-adapter-react';

import {WalletModalProvider} from '@solana/wallet-adapter-react-ui';

import {wallets, endpoint} from '../utils/wallets';

export default function WalletWrapper({children}) {
  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}
