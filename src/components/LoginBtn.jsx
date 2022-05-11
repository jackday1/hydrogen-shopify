import metamask from '../assets/metamask.png';

const LoginBtn = ({onClick}) => {
  return (
    <button title="Connect metamask" onClick={onClick}>
      <img src={metamask} alt="login" />
    </button>
  );
};

export default LoginBtn;
