import { useEffect, useState } from 'react'

const API = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

function Loans() {
  const [loans, setLoans] = useState([])
  const [books, setBooks] = useState([])
  const [members, setMembers] = useState([])
  const [form, setForm] = useState({ book_id: '', member_id: '', days: 14 })

  const fetchAll = async () => {
    try {
      const [lb, lm, ll] = await Promise.all([
        fetch(`${API}/api/books`).then(r=>r.json()),
        fetch(`${API}/api/members`).then(r=>r.json()),
        fetch(`${API}/api/loans`).then(r=>r.json()),
      ])
      setBooks(lb)
      setMembers(lm)
      setLoans(ll)
    } catch (e) { console.error(e) }
  }

  useEffect(() => { fetchAll() }, [])

  const createLoan = async (e) => {
    e.preventDefault()
    try {
      const res = await fetch(`${API}/api/loans`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
      if (!res.ok) throw new Error('Failed to create loan')
      setForm({ book_id: '', member_id: '', days: 14 })
      await fetchAll()
    } catch (e) { console.error(e) }
  }

  const returnLoan = async (id) => {
    try {
      const res = await fetch(`${API}/api/loans/${id}/return`, { method: 'POST' })
      if (!res.ok) throw new Error('Failed to return loan')
      await fetchAll()
    } catch (e) { console.error(e) }
  }

  return (
    <div className="space-y-6">
      <div className="bg-slate-800/50 border border-blue-500/20 rounded-xl p-4">
        <form onSubmit={createLoan} className="grid md:grid-cols-5 gap-3">
          <select className="bg-slate-900/60 rounded-lg px-3 py-2 text-blue-100 border border-slate-700" value={form.book_id} onChange={e=>setForm({...form,book_id:e.target.value})} required>
            <option value="">Select book</option>
            {books.map(b => (
              <option key={b._id} value={b._id} disabled={b.copies_available<=0}>{b.title} {b.copies_available<=0 ? '(none available)' : ''}</option>
            ))}
          </select>
          <select className="bg-slate-900/60 rounded-lg px-3 py-2 text-blue-100 border border-slate-700" value={form.member_id} onChange={e=>setForm({...form,member_id:e.target.value})} required>
            <option value="">Select member</option>
            {members.map(m => (
              <option key={m._id} value={m._id}>{m.name}</option>
            ))}
          </select>
          <input type="number" min={1} className="bg-slate-900/60 rounded-lg px-3 py-2 text-blue-100 border border-slate-700" value={form.days} onChange={e=>setForm({...form,days:e.target.value})} />
          <div className="md:col-span-2">
            <button className="w-full bg-blue-500 hover:bg-blue-600 text-white rounded-lg px-4 py-2">Create Loan</button>
          </div>
        </form>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {loans.length === 0 ? (
          <p className="text-blue-200">No loans yet</p>
        ) : (
          loans.map(l => (
            <div key={l._id} className="bg-slate-800/50 border border-blue-500/20 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-white text-lg font-semibold">Loan</h3>
                  <p className="text-blue-300/80 text-sm">Book ID: {l.book_id}</p>
                  <p className="text-blue-300/80 text-sm">Member ID: {l.member_id}</p>
                  <p className="text-blue-300/80 text-sm">Status: {l.status}</p>
                </div>
                {l.status !== 'returned' && (
                  <button onClick={() => returnLoan(l._id)} className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg px-3 py-2">Mark Returned</button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default Loans
