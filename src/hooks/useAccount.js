import {useEffect, useState, useCallback} from 'react';
import {useMoralis, useChain} from 'react-moralis';

import Token from '../abis/MIRL.json';

const appId = 'mKu4P0mSPKHy23MV7IzqCdRxZIMbEvcKlbQE56d7';
const serverUrl = 'https://6zitu24v62ou.usemoralis.com:2053/server';

const networkId = 1;
const chainId = '0x1';

const hasMetaMask =
  typeof window !== 'undefined' && typeof window.ethereum !== 'undefined';
const baseContractAddress =
  networkId && Token.networks[networkId]
    ? Token.networks[networkId].address
    : null;

const useAccount = () => {
  const [web3, setWeb3] = useState(null);
  const [baseContract, setBaseContract] = useState(null);
  const [balance, setBalance] = useState(null);

  const {
    authenticate,
    isInitialized,
    initialize,
    isAuthenticating,
    isAuthenticated,
    user,
    account,
    Moralis,
  } = useMoralis();

  const {chainId: currentChainId, switchNetwork} = useChain();

  useEffect(() => {
    (async () => {
      if (!isInitialized) {
        initialize({appId, serverUrl});
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

    const _web3 = new window.Web3(Moralis.provider);
    setWeb3(_web3);

    if (currentChainId !== chainId) {
      await switchNetwork(chainId);
    }
  };

  const getBalance = useCallback(async () => {
    if (
      !isAuthenticated ||
      !currentChainId ||
      !account ||
      !baseContract ||
      !baseContractAddress
    )
      return;
    if (currentChainId !== chainId) {
      setBalance(null);
      return;
    }

    try {
      const balanceOfResult = await Moralis.executeFunction({
        contractAddress: baseContractAddress,
        functionName: 'balanceOf',
        abi: Token.abi,
        params: {
          owner: account,
        },
      });
      console.log('balanceOf: ', balanceOfResult.toString());
      setBalance(balanceOfResult.toNumber());
    } catch (err) {
      console.error(err.message);
      // alert(JSON.stringify(err));
    }
  }, [isAuthenticated, account, baseContract, currentChainId]);

  useEffect(() => {
    if (web3 && baseContractAddress) {
      const _baseContract = new web3.eth.Contract(
        Token.abi,
        baseContractAddress,
      );
      setBaseContract(_baseContract);
    }
  }, [web3]);

  useEffect(() => {
    getBalance();
  }, [getBalance]);

  return {
    Moralis,
    isAuthenticated,
    isAuthenticating,
    user,
    account,
    balance,
    connectMetamaskWallet,
  };
};

export default useAccount;
