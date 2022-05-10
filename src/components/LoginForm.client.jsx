import { useState } from 'react';
import { useNavigate } from '@shopify/hydrogen/client';
import axios from 'axios';
import { MoralisProvider } from "react-moralis";

import useAccount from '../hooks/useAccount';

function Form() {
  // const navigate = useNavigate();
  const { isAuthenticated, account, user, connectMetamaskWallet } = useAccount()

  // const [email, setEmail] = useState('jack.nguyen@weareday.one');
  // const [password, setPassword] = useState('123123');

  // const login = async () => {
  //   try {
  //     if (!email || !password) return

  //     await axios.post('/auth/login', { email, password }, { withCredentials: true });
  //     navigate("/", { replace: true })
  //   } catch(err) {
  //     console.error(err)
  //   }
  // };

  if (!isAuthenticated) return <button onClick={connectMetamaskWallet}>Connect metamask wallet</button>

  return <div>
    <p>Logged account: {account}</p>
    <p>Moralis user session token: {user.getSessionToken()} {`==>`} Use this token to authenticate moralis user on the server</p>
  </div>

  // return (
  //   <div
  //     style={{
  //       padding: 16,
  //       display: 'flex',
  //       flexDirection: 'column',
  //       alignItems: 'center',
  //       justifyContent: 'center',
  //     }}
  //   >
  //     <input
  //       name="email"
  //       value={email}
  //       onChange={(e) => setEmail(e.target.value)}
  //       placeholder="Email"
  //     />
  //     <input
  //       name="password"
  //       type="password"
  //       value={password}
  //       onChange={(e) => setPassword(e.target.value)}
  //       placeholder="Password"
  //     />
  //     <button onClick={login}>Login</button>
  //   </div>
  // );
}

const appId = "mKu4P0mSPKHy23MV7IzqCdRxZIMbEvcKlbQE56d7"
const serverUrl = "https://6zitu24v62ou.usemoralis.com:2053/server"

export default function LoginForm() {
  return <MoralisProvider appId={appId} serverUrl={serverUrl}><Form /></MoralisProvider>
}


