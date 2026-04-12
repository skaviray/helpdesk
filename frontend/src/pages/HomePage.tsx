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
    await fetch(`/api/tickets/${id}`, { method: "DELETE", credentials: "include" });
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
    <div className="app">
      <div className="health-bar">
        <span className={`health-dot ${healthError ? "health-down" : "health-up"}`} />
        {healthError
          ? "API Offline"
          : health
            ? `API Online — uptime: ${Math.floor(health.uptime)}s`
            : "Checking..."}
      </div>

      <h1>Ticketing App</h1>

      <form onSubmit={handleSubmit} className="ticket-form">
        <input
          type="text"
          placeholder="Ticket title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button type="submit">Create Ticket</button>
      </form>

      <div className="ticket-list">
        {tickets.map((ticket) => (
          <div key={ticket.id} className={`ticket ticket-${ticket.status}`}>
            <div className="ticket-header">
              <h3>{ticket.title}</h3>
              <span className={`badge badge-${ticket.status}`}>
                {ticket.status}
              </span>
            </div>
            <p>{ticket.description}</p>
            <div className="ticket-actions">
              <select
                value={ticket.status}
                onChange={(e) =>
                  handleStatusChange(
                    ticket.id,
                    e.target.value as Ticket["status"]
                  )
                }
              >
                <option value="open">Open</option>
                <option value="in-progress">In Progress</option>
                <option value="closed">Closed</option>
              </select>
              <button onClick={() => handleDelete(ticket.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default HomePage;
