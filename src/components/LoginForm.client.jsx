import {useState} from 'react';
import { useNavigate } from '@shopify/hydrogen/client';
import axios from 'axios';

export default function LoginForm() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('jack.nguyen@weareday.one');
  const [password, setPassword] = useState('123123');

  const login = async () => {
    try {
      if (!email || !password) return

      await axios.post('/auth/login', { email, password }, { withCredentials: true });
      navigate("/", { replace: true })
    } catch(err) {
      console.error(err)
    }
  };

  return (
    <div
      style={{
        padding: 16,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <input
        name="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <input
        name="password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      <button onClick={login}>Login</button>
    </div>
  );
}
