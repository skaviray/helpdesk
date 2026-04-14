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
    <nav className="flex justify-between items-center px-8 py-3 bg-slate-800 text-white">
      <span className="text-xl font-bold">Ticketing App</span>
      <div className="flex items-center gap-4">
        <span className="text-sm text-slate-300">{session.user.name}</span>
        <button
          onClick={handleSignOut}
          className="px-3 py-1.5 text-sm text-slate-300 border border-slate-600 rounded-md hover:bg-slate-700 hover:text-white cursor-pointer"
        >
          Sign Out
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
