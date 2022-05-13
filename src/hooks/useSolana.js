import {useState, useEffect} from 'react';
import {Connection, PublicKey, clusterApiUrl} from '@solana/web3.js';
import get from 'lodash/get';
import axios from 'axios';

import environments from '../utils/environments';

const {NETWORK, ASSOCIATED_TOKEN_ADDRESS} = environments;
const connection = new Connection(clusterApiUrl(NETWORK), 'confirmed');

const useSolana = (isLogged) => {
  const [walletAvailable, setWalletAvailable] = useState(false);
  const [provider, setProvider] = useState(null);
  const [connected, setConnected] = useState(false);
  const [publicKey, setPublicKey] = useState(null);
  const [balance, setBalance] = useState(null);

  useEffect(() => {
    if (isLogged) {
      if ('solana' in window) {
        if (window?.solana?.isPhantom) {
          setProvider(window.solana);
          setWalletAvailable(true);
          // Attemp an eager connection
          window.solana.connect({onlyIfTrusted: true}).catch(() => {
            axios
              .post('/auth/login', {
                publicKey,
                balance,
              })
              .then((res) => res.data.reload && window.location.reload())
              .catch((err) => console.error(err));
          });
        }
      }
    }
  }, [isLogged]);

  useEffect(() => {
    provider?.on('connect', (account) => {
      console.log(`connect event: ${account}`);
      setConnected(true);
      setPublicKey(account);
    });
    provider?.on('disconnect', async () => {
      console.log('disconnect event');
      setConnected(false);
      setPublicKey(null);
    });
    provider?.on('accountChanged', (newAccount) => {
      const newPublicKey = newAccount.toString();
      console.log('account changed', newPublicKey);
      setPublicKey(newPublicKey);
    });
  }, [provider]);

  const connectHandler = async (event) => {
    try {
      if (provider) {
        console.log(`connect handler`);
        await provider?.connect();
      } else if ('solana' in window) {
        if (window?.solana?.isPhantom) {
          console.log(`connect handler`);
          await window.solana.connect();
          setProvider(window.solana);
          setWalletAvailable(true);
          // Attemp an eager connection
          window.solana.connect({onlyIfTrusted: true});
        }
      }
    } catch (err) {
      console.error('connect error:', err);
    }
  };

  const disconnectHandler = async (event) => {
    try {
      console.log('disconnect handler');
      await provider?.disconnect();
      await axios.delete('/auth/login');
      window.location.reload();
    } catch (err) {
      console.error('disconnect error:', err);
    }
  };

  const getBalance = async () => {
    try {
      if (!publicKey) return;
      const result = await connection.getParsedTokenAccountsByOwner(publicKey, {
        mint: new PublicKey(ASSOCIATED_TOKEN_ADDRESS),
      });
      const newBalance = get(
        result,
        'value[0].account.data.parsed.info.tokenAmount.uiAmount',
        0,
      );
      setBalance(newBalance);
    } catch (err) {
      console.error(err);
      setBalance(0);
    }
  };

  useEffect(() => {
    getBalance();
  }, [publicKey]);

  useEffect(() => {
    if (connected && publicKey && balance !== null) {
      axios
        .post('/auth/login', {
          publicKey,
          balance,
        })
        .then((res) => res.data.reload && window.location.reload())
        .catch((err) => console.error(err));
    }
  }, [publicKey, balance, connected]);

  return {
    walletAvailable,
    connected,
    publicKey,
    connectHandler,
    disconnectHandler,
  };
};

export default useSolana;
