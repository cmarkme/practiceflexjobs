'use client';
import { useEffect, useState } from 'react';
import { api } from '../../lib/api';


type Client = { id: string; name: string; email: string };


type ListResp = { data: Client[] };


export default function ClientsPage() {
const [items, setItems] = useState<Client[]>([]);
const [name, setName] = useState('');
const [email, setEmail] = useState('');
const [loading, setLoading] = useState(false);
const [error, setError] = useState<string | null>(null);


async function load() {
try {
setError(null);
const json = await api<ListResp>('/api/clients');
setItems(json.data);
} catch (e: any) { setError(e.message); }
}


useEffect(() => { load(); }, []);


async function onSubmit(e: React.FormEvent) {
e.preventDefault();
setLoading(true);
setError(null);
try {
await api('/api/clients', { method: 'POST', body: JSON.stringify({ name, email }) });
setName(''); setEmail('');
await load();
} catch (e: any) { setError(e.message); }
finally { setLoading(false); }
}


return (
<div className="p-6 max-w-xl mx-auto space-y-6">
<h1 className="text-2xl font-bold">Clients</h1>
<form onSubmit={onSubmit} className="space-y-3">
<input className="border p-2 w-full" placeholder="Name" value={name} onChange={e=>setName(e.target.value)} />
<input className="border p-2 w-full" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
<button disabled={loading} className="border px-4 py-2">{loading ? 'Saving…' : 'Add Client'}</button>
</form>
{error && <p className="text-red-600">{error}</p>}
<ul className="divide-y">
{items.map(c => (
<li key={c.id} className="py-2"><b>{c.name}</b> — {c.email}</li>
))}
</ul>
</div>
);
}