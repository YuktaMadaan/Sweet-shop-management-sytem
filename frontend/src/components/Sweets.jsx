import React, { useEffect, useState } from 'react'

export default function Sweets({ token }) {
  const [sweets, setSweets] = useState([])
  const [query, setQuery] = useState('')

  async function load() {
    const res = await fetch('/api/sweets', {
      headers: { Authorization: `Bearer ${token}` }
    })
    const data = await res.json()
    setSweets(data)
  }

  useEffect(() => {
    if (token) load()
  }, [token])

  async function purchase(id) {
    await fetch(`/api/sweets/${id}/purchase`, { method: 'POST', headers: { Authorization: `Bearer ${token}` } })
    load()
  }

  async function search(e) {
    e.preventDefault()
    const res = await fetch(`/api/sweets/search?name=${encodeURIComponent(query)}`, { headers: { Authorization: `Bearer ${token}` } })
    const data = await res.json()
    setSweets(data)
  }

  return (
    <section>
      <h2>Available Sweets</h2>
      <form onSubmit={search} className="search">
        <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search by name" />
        <button>Search</button>
        <button type="button" onClick={load}>Reset</button>
      </form>
      <div className="grid">
        {sweets.map(s => (
          <div className="card" key={s._id}>
            <h4>{s.name}</h4>
            <div>Category: {s.category}</div>
            <div>Price: ${s.price}</div>
            <div>Quantity: {s.quantity}</div>
            <button disabled={s.quantity <= 0} onClick={() => purchase(s._id)}>{s.quantity > 0 ? 'Purchase' : 'Out of stock'}</button>
          </div>
        ))}
      </div>
    </section>
  )
}
