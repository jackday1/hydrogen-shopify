import { useEffect } from 'react';
import { useMoralis, useChain } from 'react-moralis';
// import Web3 from 'web3';

const appId = "mKu4P0mSPKHy23MV7IzqCdRxZIMbEvcKlbQE56d7"
const serverUrl = "https://6zitu24v62ou.usemoralis.com:2053/server"

const networkId = 4;
const chainId = '0x4';

const hasMetaMask = typeof window !== 'undefined' && typeof window.ethereum !== 'undefined';

const useAccount = () => {
  const { authenticate, isInitialized, initialize, isAuthenticating, isAuthenticated, user, account, Moralis } =
    useMoralis();

  const { chainId: currentChainId, switchNetwork } = useChain();

  useEffect(() => {
    (async () => {
      if (!isInitialized) {
        initialize({ appId, serverUrl });
      }
    })();
  }, []);

  const connectMetamaskWallet = async () => {
    if (!hasMetaMask) {
      alert('Please install metamask extension and reload page!');
      return;
    }

    await authenticate();

    if (!Moralis.isWeb3Enabled()) {
      await Moralis.enableWeb3();
    }

    if (currentChainId !== chainId) {
      await switchNetwork(chainId);
    }
  };

  return {
    Moralis,
    isAuthenticated,
    isAuthenticating,
    user,
    account,
    connectMetamaskWallet,
  };
};

export default useAccount;
