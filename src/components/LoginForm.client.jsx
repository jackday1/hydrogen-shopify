import {useState} from 'react';
import {useNavigate} from '@shopify/hydrogen/client';
import axios from 'axios';
import {MoralisProvider} from 'react-moralis';

import useAccount from '../hooks/useAccount';

function Form() {
  const navigate = useNavigate();
  const {isAuthenticated, account, user, balance, connectMetamaskWallet} =
    useAccount();
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
  // console.log({account, user});
  if (!isAuthenticated)
    return (
      <button onClick={connectMetamaskWallet}>Connect metamask wallet</button>
    );
  return (
    <div>
      <p>Logged account: {account}</p>
      <p>Balance: {balance}</p>
      <p>
        Moralis user session token: {user.getSessionToken()} {`==>`} Use this
        token to authenticate moralis user on the server
      </p>
      <button onClick={() => navigate('/', {replace: true})}>
        Back to home
      </button>
    </div>
  );
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

const appId = 'mKu4P0mSPKHy23MV7IzqCdRxZIMbEvcKlbQE56d7';
const serverUrl = 'https://6zitu24v62ou.usemoralis.com:2053/server';

export default function LoginForm() {
  return (
    <MoralisProvider initializeOnMount={false}>
      <Form />
    </MoralisProvider>
  );
}

// export default function LoginForm() {
//   return <div>Login form</div>;
// }
