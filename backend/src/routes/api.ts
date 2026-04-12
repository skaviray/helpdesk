import { Router } from "express";
import { requireAuth } from "../middleware/requireAuth";

export const apiRouter = Router();

interface Ticket {
  id: number;
  title: string;
  description: string;
  status: "open" | "in-progress" | "closed";
}

const tickets: Ticket[] = [
  { id: 1, title: "Fix login bug", description: "Users cannot log in with email", status: "open" },
  { id: 2, title: "Add dark mode", description: "Implement dark mode toggle", status: "in-progress" },
  { id: 3, title: "Update docs", description: "Update API documentation", status: "closed" },
];

let nextId = 4;

apiRouter.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

apiRouter.use("/tickets", requireAuth);

apiRouter.get("/tickets", (_req, res) => {
  res.json(tickets);
});

apiRouter.get("/tickets/:id", (req, res) => {
  const ticket = tickets.find((t) => t.id === Number(req.params.id));
  if (!ticket) {
    res.status(404).json({ error: "Ticket not found" });
    return;
  }
  res.json(ticket);
});

apiRouter.post("/tickets", (req, res) => {
  const { title, description } = req.body;
  if (!title || !description) {
    res.status(400).json({ error: "Title and description are required" });
    return;
  }
  const ticket: Ticket = { id: nextId++, title, description, status: "open" };
  tickets.push(ticket);
  res.status(201).json(ticket);
});

apiRouter.patch("/tickets/:id", (req, res) => {
  const ticket = tickets.find((t) => t.id === Number(req.params.id));
  if (!ticket) {
    res.status(404).json({ error: "Ticket not found" });
    return;
  }
  const { title, description, status } = req.body;
  if (title) ticket.title = title;
  if (description) ticket.description = description;
  if (status) ticket.status = status;
  res.json(ticket);
});

apiRouter.delete("/tickets/:id", (req, res) => {
  const index = tickets.findIndex((t) => t.id === Number(req.params.id));
  if (index === -1) {
    res.status(404).json({ error: "Ticket not found" });
    return;
  }
  const [deleted] = tickets.splice(index, 1);
  res.json(deleted);
});
