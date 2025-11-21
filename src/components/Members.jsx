import { useEffect, useState } from 'react'

const API = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

function Members() {
  const [members, setMembers] = useState([])
  const [form, setForm] = useState({ name: '', email: '', membership_id: '', phone: '' })

  const fetchMembers = async () => {
    try {
      const res = await fetch(`${API}/api/members`)
      const data = await res.json()
      setMembers(data)
    } catch (e) { console.error(e) }
  }

  useEffect(() => { fetchMembers() }, [])

  const submit = async (e) => {
    e.preventDefault()
    try {
      const payload = {
        name: form.name,
        email: form.email,
        membership_id: form.membership_id || undefined,
        phone: form.phone || undefined,
      }
      const res = await fetch(`${API}/api/members`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      if (!res.ok) throw new Error('Failed to add member')
      setForm({ name: '', email: '', membership_id: '', phone: '' })
      await fetchMembers()
    } catch (e) { console.error(e) }
  }

  return (
    <div className="space-y-6">
      <div className="bg-slate-800/50 border border-blue-500/20 rounded-xl p-4">
        <form onSubmit={submit} className="grid md:grid-cols-5 gap-3">
          <input className="bg-slate-900/60 rounded-lg px-3 py-2 text-blue-100 placeholder-blue-300/50 border border-slate-700" placeholder="Full name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} required />
          <input type="email" className="bg-slate-900/60 rounded-lg px-3 py-2 text-blue-100 placeholder-blue-300/50 border border-slate-700" placeholder="Email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} required />
          <input className="bg-slate-900/60 rounded-lg px-3 py-2 text-blue-100 placeholder-blue-300/50 border border-slate-700" placeholder="Membership ID" value={form.membership_id} onChange={e=>setForm({...form,membership_id:e.target.value})} />
          <input className="bg-slate-900/60 rounded-lg px-3 py-2 text-blue-100 placeholder-blue-300/50 border border-slate-700" placeholder="Phone" value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} />
          <button className="bg-blue-500 hover:bg-blue-600 text-white rounded-lg px-4 py-2">Add Member</button>
        </form>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {members.length === 0 ? (
          <p className="text-blue-200">No members yet</p>
        ) : (
          members.map(m => (
            <div key={m._id} className="bg-slate-800/50 border border-blue-500/20 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-white text-lg font-semibold">{m.name}</h3>
                  <p className="text-blue-300/80 text-sm">{m.email}</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded ${m.is_active !== false ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'}`}>{m.is_active !== false ? 'active' : 'inactive'}</span>
              </div>
              {m.membership_id && <p className="text-blue-200/70 text-sm mt-2">ID: {m.membership_id}</p>}
              {m.phone && <p className="text-blue-200/70 text-sm">Phone: {m.phone}</p>}
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default Members
