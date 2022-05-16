import {useEffect, useState} from 'react';
import {useConnection, useWallet} from '@solana/wallet-adapter-react';
import {PublicKey} from '@solana/web3.js';
import get from 'lodash/get';

import environments from '../utils/environments';
import axios from 'axios';

const {ASSOCIATED_TOKEN_ADDRESS} = environments;

const useSolanaWallet = () => {
  const [provider, setProvider] = useState(null);
  const [balance, setBalance] = useState(null);
  const {connection} = useConnection();
  const {publicKey} = useWallet();

  useEffect(() => {
    if ('solana' in window) {
      if (window?.solana?.isPhantom) {
        setProvider(window.solana);
      }
    }
  }, []);

  useEffect(() => {
    provider?.on('accountChanged', () => {
      window.location.reload();
    });
    provider?.on('disconnect', () => {
      window.location.reload();
    });
  }, [provider]);

  const getBalance = async () => {
    try {
      if (!publicKey) return;
      // use sol for the moment
      // change to our own token later
      const solBalance = await connection.getBalance(publicKey);
      const newBalance = solBalance / 1e9;

      // code to get balance of our own token
      // const result = await connection.getParsedTokenAccountsByOwner(publicKey, {
      //   mint: new PublicKey(ASSOCIATED_TOKEN_ADDRESS),
      // });
      // const newBalance = get(
      //   result,
      //   'value[0].account.data.parsed.info.tokenAmount.uiAmount',
      //   0,
      // );
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
    if (publicKey && balance !== null) {
      axios
        .post('/auth/login', {
          publicKey,
          balance,
        })
        .then((res) => res.data.reload && window.location.reload())
        .catch((err) => console.error(err));
    }

    if (!publicKey && balance !== null) {
      axios.delete('/auth/login').then(() => window.location.reload());
    }
  }, [publicKey, balance]);
};

export default useSolanaWallet;
