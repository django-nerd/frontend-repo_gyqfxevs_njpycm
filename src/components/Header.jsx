import { BookOpen, Users, ClipboardList } from 'lucide-react'

function Header({ active, setActive }) {
  const tabs = [
    { key: 'books', label: 'Books', icon: BookOpen },
    { key: 'members', label: 'Members', icon: Users },
    { key: 'loans', label: 'Loans', icon: ClipboardList },
  ]

  return (
    <header className="relative z-10 py-8">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <img src="/flame-icon.svg" alt="Logo" className="w-10 h-10" />
          <div>
            <h1 className="text-white text-2xl font-semibold leading-tight">Digital Library</h1>
            <p className="text-blue-200/70 text-sm">Manage books, members, and loans</p>
          </div>
        </div>
        <nav className="bg-slate-800/50 border border-blue-500/20 rounded-xl p-1 flex gap-1">
          {tabs.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActive(key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${active === key ? 'bg-blue-500 text-white' : 'text-blue-200 hover:bg-slate-700/60'}`}
            >
              <Icon size={18} />
              <span className="hidden sm:inline">{label}</span>
            </button>
          ))}
        </nav>
      </div>
    </header>
  )
}

export default Header
