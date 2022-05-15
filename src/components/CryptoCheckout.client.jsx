import {useState} from 'react';

const CryptoCheckout = ({isOpen, close, text, transfer}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');

  const doTransfer = async () => {
    setIsLoading(true);

    try {
      if (!email || !email.trim()) throw new Error('Email is invalid');
      await transfer(email);
      setEmail('');
    } catch (err) {
      console.error(err);
      alert(err.message);
    }

    setIsLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed top-0 left-0 w-screen h-screen bg-gray-300 bg-opacity-50 flex justify-center items-center"
      onClick={close}
    >
      <div
        className="w-50 px-4 py-2 bg-white rounded shadow space-y-2"
        onClick={(e) => e.stopPropagation()}
      >
        <p>{text}</p>
        <input
          type="text"
          placeholder="Enter your email"
          class="px-4 py-2 w-full leading-tight border border-black"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button
          className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={doTransfer}
          disabled={isLoading}
        >
          Buy with crypto currency
        </button>
      </div>
    </div>
  );
};

export default CryptoCheckout;
