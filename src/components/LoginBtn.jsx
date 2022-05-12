import phantom from '../assets/phantom.png';

const LoginBtn = ({onClick}) => {
  return (
    <button className="mr-2" title="Connect Phantom wallet" onClick={onClick}>
      <img src={phantom} alt="login" />
    </button>
  );
};

export default LoginBtn;
