import logout from '../assets/logout.png';

const LogoutBtn = ({onClick}) => {
  return (
    <button title="Logout Moralis" onClick={onClick}>
      <img width={24} height={24} src={logout} alt="logout" />
    </button>
  );
};

export default LogoutBtn;
