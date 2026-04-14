import { useState, useEffect } from "react";

interface Ticket {
  id: number;
  title: string;
  description: string;
  status: "open" | "in-progress" | "closed";
}

interface HealthStatus {
  status: string;
  uptime: number;
  timestamp: string;
}

const statusBorder: Record<Ticket["status"], string> = {
  open: "border-l-blue-600",
  "in-progress": "border-l-amber-500",
  closed: "border-l-emerald-500",
};

const statusBadge: Record<Ticket["status"], string> = {
  open: "bg-blue-100 text-blue-600",
  "in-progress": "bg-amber-100 text-amber-600",
  closed: "bg-emerald-100 text-emerald-600",
};

function HomePage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [health, setHealth] = useState<HealthStatus | null>(null);
  const [healthError, setHealthError] = useState(false);

  useEffect(() => {
    fetchTickets();
    fetchHealth();
    const interval = setInterval(fetchHealth, 10000);
    return () => clearInterval(interval);
  }, []);

  async function fetchHealth() {
    try {
      const res = await fetch("/api/health", { credentials: "include" });
      const data = await res.json();
      setHealth(data);
      setHealthError(false);
    } catch {
      setHealth(null);
      setHealthError(true);
    }
  }

  async function fetchTickets() {
    const res = await fetch("/api/tickets", { credentials: "include" });
    const data = await res.json();
    setTickets(data);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    const res = await fetch("/api/tickets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, description }),
      credentials: "include",
    });
    const newTicket = await res.json();
    setTickets((prev) => [...prev, newTicket]);
    setTitle("");
    setDescription("");
  }

  async function handleDelete(id: number) {
    await fetch(`/api/tickets/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    setTickets((prev) => prev.filter((t) => t.id !== id));
  }

  async function handleStatusChange(id: number, status: Ticket["status"]) {
    const res = await fetch(`/api/tickets/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
      credentials: "include",
    });
    const updated = await res.json();
    setTickets((prev) => prev.map((t) => (t.id === id ? updated : t)));
  }

  return (
    <div className="max-w-3xl mx-auto p-8">
      <div className="flex items-center gap-2 px-4 py-2 mb-4 bg-white rounded-lg shadow-sm text-sm text-gray-500">
        <span
          className={`w-2.5 h-2.5 rounded-full ${
            healthError
              ? "bg-red-500 shadow-[0_0_6px_theme(colors.red.500)]"
              : "bg-emerald-500 shadow-[0_0_6px_theme(colors.emerald.500)]"
          }`}
        />
        {healthError
          ? "API Offline"
          : health
            ? `API Online — uptime: ${Math.floor(health.uptime)}s`
            : "Checking..."}
      </div>

      <h1 className="text-3xl font-bold mb-6">Ticketing App</h1>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-3 mb-8 p-6 bg-white rounded-lg shadow-sm"
      >
        <input
          type="text"
          placeholder="Ticket title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="px-3 py-3 border border-gray-300 rounded-md text-base"
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="px-3 py-3 border border-gray-300 rounded-md text-base min-h-20 resize-y"
        />
        <button
          type="submit"
          className="px-3 py-3 bg-blue-600 text-white rounded-md text-base hover:bg-blue-700 cursor-pointer"
        >
          Create Ticket
        </button>
      </form>

      <div className="flex flex-col gap-4">
        {tickets.map((ticket) => (
          <div
            key={ticket.id}
            className={`p-5 bg-white rounded-lg shadow-sm border-l-4 ${statusBorder[ticket.status]}`}
          >
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-semibold">{ticket.title}</h3>
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold uppercase ${statusBadge[ticket.status]}`}
              >
                {ticket.status}
              </span>
            </div>
            <p className="text-gray-500 mb-4">{ticket.description}</p>
            <div className="flex items-center gap-2">
              <select
                value={ticket.status}
                onChange={(e) =>
                  handleStatusChange(
                    ticket.id,
                    e.target.value as Ticket["status"]
                  )
                }
                className="px-2 py-1.5 border border-gray-300 rounded-md text-sm"
              >
                <option value="open">Open</option>
                <option value="in-progress">In Progress</option>
                <option value="closed">Closed</option>
              </select>
              <button
                onClick={() => handleDelete(ticket.id)}
                className="px-3 py-1.5 bg-red-500 text-white rounded-md text-sm hover:bg-red-600 cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default HomePage;
