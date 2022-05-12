import {useNavigate} from '@shopify/hydrogen/client';
import {MoralisProvider} from 'react-moralis';

import useAccount from '../hooks/useAccount';
import environments from '../utils/environments';

const {MORALIS_APP_ID, MORALIS_SERVER_URL} = environments;

function Form() {
  const navigate = useNavigate();
  const {isAuthenticated, account, user, balance, connectPhantomWallet} =
    useAccount();

  const login = async () => {
    await connectPhantomWallet();
    navigate('/', {replace: true});
  };

  if (!isAuthenticated)
    return (
      <div className="h-screen w-screen flex justify-center items-center">
        <button
          className="bg-orange-500 rounded px-4 py-2 text-white font-semibold transition ease-in-out hover:bg-orange-600"
          onClick={login}
        >
          Connect Phantom wallet
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

export default function LoginForm() {
  return (
    <MoralisProvider appId={MORALIS_APP_ID} serverUrl={MORALIS_SERVER_URL}>
      <Form />
    </MoralisProvider>
  );
}
