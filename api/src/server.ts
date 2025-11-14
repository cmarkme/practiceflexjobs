import "dotenv/config";
import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";

const app = express();
const prisma = new PrismaClient();

app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());

app.get("/health", (_req, res) => res.json({ ok: true }));
// In-memory store (swap for DB later)
interface Client { id: string; name: string; email: string }
const clients: Client[] = [];


const NewClient = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  company: z.string().optional(),
});

// LIST
app.get('/api/clients', (_req, res) => {
    res.json({ data: clients });
  });
  
  // CREATE
  app.post('/api/clients', (req, res) => {
    const { name, email } = req.body || {};
    if (!name || !email) return res.status(400).json({ error: 'name and email required' });
    const id = String(Date.now());
    const client = { id, name, email };
    clients.push(client);
    res.status(201).json({ data: client });
  });
  

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`API listening on http://localhost:${port}`);
});
