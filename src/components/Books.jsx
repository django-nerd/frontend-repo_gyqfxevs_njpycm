import { useEffect, useState } from 'react'

const API = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

function Books() {
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(false)
  const [q, setQ] = useState('')
  const [form, setForm] = useState({ title: '', author: '', isbn: '', published_year: '', categories: '', copies_total: 1 })

  const fetchBooks = async () => {
    setLoading(true)
    try {
      const res = await fetch(`${API}/api/books${q ? `?q=${encodeURIComponent(q)}` : ''}`)
      const data = await res.json()
      setBooks(data)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchBooks() }, [])

  const submit = async (e) => {
    e.preventDefault()
    try {
      const payload = {
        title: form.title,
        author: form.author,
        isbn: form.isbn || undefined,
        published_year: form.published_year ? Number(form.published_year) : undefined,
        categories: form.categories ? form.categories.split(',').map(s => s.trim()).filter(Boolean) : [],
        description: undefined,
        copies_total: Number(form.copies_total) || 1,
      }
      const res = await fetch(`${API}/api/books`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      if (!res.ok) throw new Error('Failed to add book')
      setForm({ title: '', author: '', isbn: '', published_year: '', categories: '', copies_total: 1 })
      await fetchBooks()
    } catch (e) { console.error(e) }
  }

  return (
    <div className="space-y-6">
      <div className="bg-slate-800/50 border border-blue-500/20 rounded-xl p-4">
        <form onSubmit={submit} className="grid md:grid-cols-6 gap-3">
          <input className="col-span-2 bg-slate-900/60 rounded-lg px-3 py-2 text-blue-100 placeholder-blue-300/50 border border-slate-700" placeholder="Title" value={form.title} onChange={e=>setForm({...form,title:e.target.value})} required />
          <input className="col-span-2 bg-slate-900/60 rounded-lg px-3 py-2 text-blue-100 placeholder-blue-300/50 border border-slate-700" placeholder="Author" value={form.author} onChange={e=>setForm({...form,author:e.target.value})} required />
          <input className="bg-slate-900/60 rounded-lg px-3 py-2 text-blue-100 placeholder-blue-300/50 border border-slate-700" placeholder="ISBN" value={form.isbn} onChange={e=>setForm({...form,isbn:e.target.value})} />
          <input className="bg-slate-900/60 rounded-lg px-3 py-2 text-blue-100 placeholder-blue-300/50 border border-slate-700" placeholder="Year" value={form.published_year} onChange={e=>setForm({...form,published_year:e.target.value})} />
          <input className="md:col-span-3 bg-slate-900/60 rounded-lg px-3 py-2 text-blue-100 placeholder-blue-300/50 border border-slate-700" placeholder="Categories (comma separated)" value={form.categories} onChange={e=>setForm({...form,categories:e.target.value})} />
          <input type="number" className="bg-slate-900/60 rounded-lg px-3 py-2 text-blue-100 placeholder-blue-300/50 border border-slate-700" placeholder="Copies" value={form.copies_total} min={1} onChange={e=>setForm({...form,copies_total:e.target.value})} />
          <button className="col-span-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg px-4 py-2">Add Book</button>
        </form>
      </div>

      <div className="flex items-center gap-3">
        <input className="bg-slate-900/60 rounded-lg px-3 py-2 text-blue-100 placeholder-blue-300/50 border border-slate-700 flex-1" placeholder="Search by title, author, or category" value={q} onChange={e=>setQ(e.target.value)} />
        <button onClick={fetchBooks} className="bg-slate-700 hover:bg-slate-600 text-blue-100 rounded-lg px-4 py-2">Search</button>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {loading ? (
          <p className="text-blue-200">Loading...</p>
        ) : books.length === 0 ? (
          <p className="text-blue-200">No books found</p>
        ) : (
          books.map(b => (
            <div key={b._id} className="bg-slate-800/50 border border-blue-500/20 rounded-xl p-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-white text-lg font-semibold">{b.title}</h3>
                  <p className="text-blue-200 text-sm">by {b.author}</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded ${b.copies_available>0 ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'}`}>{b.copies_available} available</span>
              </div>
              {b.categories && b.categories.length>0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {b.categories.map((c,i)=>(<span key={i} className="text-xs bg-slate-900/60 border border-slate-700 text-blue-200 px-2 py-1 rounded">{c}</span>))}
                </div>
              )}
              {b.isbn && <p className="text-blue-300/70 text-sm mt-2">ISBN: {b.isbn}</p>}
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default Books
