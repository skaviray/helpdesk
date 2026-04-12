import { useNavigate } from "react-router-dom";
import { authClient, useSession } from "../lib/auth-client";

function Navbar() {
  const navigate = useNavigate();
  const { data: session } = useSession();

  async function handleSignOut() {
    await authClient.signOut();
    navigate("/login");
  }

  if (!session) return null;

  return (
    <nav className="navbar">
      <span className="navbar-brand">Ticketing App</span>
      <div className="navbar-right">
        <span className="navbar-user">{session.user.name}</span>
        <button onClick={handleSignOut} className="btn-signout">
          Sign Out
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
