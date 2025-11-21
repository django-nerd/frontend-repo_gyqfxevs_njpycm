import { useState } from 'react'
import Header from './components/Header'
import Books from './components/Books'
import Members from './components/Members'
import Loans from './components/Loans'

function App() {
  const [active, setActive] = useState('books')

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.08),transparent_50%)]"></div>

      <div className="relative min-h-screen">
        <Header active={active} setActive={setActive} />

        <main className="max-w-6xl mx-auto px-4 pb-16">
          {active === 'books' && <Books />}
          {active === 'members' && <Members />}
          {active === 'loans' && <Loans />}
        </main>
      </div>
    </div>
  )
}

export default App
