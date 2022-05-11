import {useNavigate} from '@shopify/hydrogen/client';
import {MoralisProvider} from 'react-moralis';

import useAccount from '../hooks/useAccount';

function Form() {
  const navigate = useNavigate();
  const {isAuthenticated, account, user, balance, connectMetamaskWallet} =
    useAccount();

  const login = async () => {
    await connectMetamaskWallet();
    // navigate('/', {replace: true});
  };

  if (!isAuthenticated)
    return (
      <div className="h-screen w-screen flex justify-center items-center">
        <button
          className="bg-orange-500 rounded px-4 py-2 text-white font-semibold transition ease-in-out hover:bg-orange-600"
          onClick={login}
        >
          Connect metamask wallet
        </button>
      </div>
    );
  return (
    <div className="h-screen w-screen flex flex-col justify-center items-center">
      <p>Logged account: {account}</p>
      <p>Balance: {balance}</p>
      <p>
        Moralis user session token: {user.getSessionToken()} {`==>`} Use this
        token to authenticate moralis user on the server
      </p>
      <button
        className="bg-orange-500 rounded px-4 py-2 text-white font-semibold transition ease-in-out hover:bg-orange-600"
        onClick={() => navigate('/', {replace: true})}
      >
        Back to home
      </button>
    </div>
  );
}

const appId = 'mKu4P0mSPKHy23MV7IzqCdRxZIMbEvcKlbQE56d7';
const serverUrl = 'https://6zitu24v62ou.usemoralis.com:2053/server';

export default function LoginForm() {
  return (
    <MoralisProvider appId={appId} serverUrl={serverUrl}>
      <Form />
    </MoralisProvider>
  );
}

// export default function LoginForm() {
//   return <div>Login form</div>;
// }
