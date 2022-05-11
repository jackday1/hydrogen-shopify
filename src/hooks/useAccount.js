import {useEffect, useState, useCallback} from 'react';
import {useMoralis, useChain} from 'react-moralis';
import axios from 'axios';

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
    logout,
    isAuthenticating,
    isAuthenticated,
    user,
    account,
    Moralis,
  } = useMoralis();

  const {chainId: currentChainId, switchNetwork} = useChain();

  useEffect(() => {
    (async () => {
      if (!Moralis.isWeb3Enabled()) {
        await Moralis.enableWeb3();
      }

      if (!isInitialized) {
        initialize({appId, serverUrl});
      }

      if (currentChainId !== chainId) {
        await switchNetwork(chainId);
      }

      const _web3 = new window.Web3(Moralis.provider);
      setWeb3(_web3);
    })();
  }, []);

  const connectMetamaskWallet = async () => {
    if (!hasMetaMask) {
      alert('Please install metamask extension and reload page!');
      return;
    }

    if (!Moralis.isWeb3Enabled()) {
      await Moralis.enableWeb3();
    }

    await authenticate();

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
      // console.log('balanceOf: ', balanceOfResult.toString());
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

  useEffect(() => {
    // auto link account when user change account
    if (user && account) {
      const accounts = user.attributes.accounts;
      if (!accounts.includes(account)) {
        Moralis.link(account).then(() => {
          console.log(`Linked account ${account}`);
          window.location.reload();
        });
      } else if (currentChainId && balance !== null) {
        axios
          .post('/auth/login', {
            sessionToken: user.getSessionToken(),
            account,
            chainId: currentChainId,
            balance,
          })
          .then((res) => res.data.reload && window.location.reload())
          .catch((err) => console.error(err));
      }
    }
    // if (user && account && currentChainId && balance !== null) {
    //   // console.log('Call login api route');
    //   axios
    //     .post('/auth/login', {
    //       sessionToken: user.getSessionToken(),
    //       account,
    //       chainId: currentChainId,
    //       balance,
    //     })
    //     .then((res) => console.log(res))
    //     .catch((err) => console.error(err));
    // }
  }, [user, account, currentChainId, balance]);

  const logOut = async () => {
    await logout();
    await axios.delete('/auth/login');
    window.location.reload();
  };

  // useEffect(() => {
  //   if (isAuthenticated && isInitialized && (!account || !currentChainId)) {
  //     connectMetamaskWallet();
  //   }
  // }, [isAuthenticated, isInitialized]);

  return {
    Moralis,
    isAuthenticated,
    isAuthenticating,
    user,
    account,
    balance,
    logOut,
    connectMetamaskWallet,
  };
};

export default useAccount;
