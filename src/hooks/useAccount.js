import {useEffect, useState, useCallback, useMemo} from 'react';
import {useMoralis, useMoralisSolanaApi} from 'react-moralis';
import axios from 'axios';

import environments from '../utils/environments';

const {MORALIS_APP_ID, MORALIS_SERVER_URL, NETWORK, ASSOCIATED_TOKEN_ADDRESS} =
  environments;

const hasWeb3 =
  typeof window !== 'undefined' && typeof window.ethereum !== 'undefined';

const signingMessage =
  'Connect your Phantom wallet to buy our merchandise with cheaper price!';

const useAccount = () => {
  const [balance, setBalance] = useState(null);

  const {
    authenticate,
    isInitialized,
    isInitializing,
    initialize,
    logout,
    isAuthenticating,
    isAuthenticated,
    user,
    Moralis,
  } = useMoralis();

  const account = useMemo(() => {
    if (!user) return null;
    return user.get('solAddress');
  }, [user]);

  const solanaApi = useMoralisSolanaApi();

  useEffect(() => {
    (async () => {
      if (!isInitialized) {
        initialize({appId: MORALIS_APP_ID, serverUrl: MORALIS_SERVER_URL});
      }
    })();
  }, []);

  const connectPhantomWallet = async () => {
    if (!hasWeb3) {
      alert('Please install Phantom wallet extension and reload page!');
      return;
    }

    if (!Moralis.isWeb3Enabled()) {
      await Moralis.enableWeb3();
    }

    await authenticate({type: 'sol', signingMessage});
  };

  const getBalance = useCallback(async () => {
    if (!isAuthenticated || !account) return;

    try {
      const {tokens} = await solanaApi.account.getPortfolio({
        address: account,
        network: NETWORK,
      });
      const token = tokens.find(
        (item) => item.associatedTokenAddress === ASSOCIATED_TOKEN_ADDRESS,
      );
      const tokenBalance = token ? token.amount : 0;
      setBalance(tokenBalance);
    } catch (err) {
      console.error(err.message);
    }
  }, [isAuthenticated, account, solanaApi]);

  useEffect(() => {
    getBalance();
  }, [getBalance]);

  useEffect(() => {
    if (user && account && balance !== null) {
      axios
        .post('/auth/login', {
          sessionToken: user.getSessionToken(),
          account,
          balance,
        })
        .then((res) => res.data.reload && window.location.reload())
        .catch((err) => console.error(err));
    }
  }, [user, account, balance]);

  const logOut = async () => {
    await logout();
    await axios.delete('/auth/login');
    window.location.reload();
  };

  return {
    Moralis,
    isInitializing,
    isAuthenticated,
    isAuthenticating,
    user,
    account,
    balance,
    logOut,
    connectPhantomWallet,
  };
};

export default useAccount;
