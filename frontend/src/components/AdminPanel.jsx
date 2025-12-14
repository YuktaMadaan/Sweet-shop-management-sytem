import React, { useState } from 'react'

export default function AdminPanel({ token }) {
  const [name, setName] = useState('')
  const [category, setCategory] = useState('')
  const [price, setPrice] = useState('')
  const [quantity, setQuantity] = useState('')
  const [message, setMessage] = useState(null)

  async function add(e) {
    e.preventDefault()
    setMessage(null)
    try {
      const res = await fetch('/api/sweets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ name, category, price: Number(price), quantity: Number(quantity) })
      })
      if (!res.ok) throw new Error('Failed')
      const data = await res.json()
      setMessage('Added ' + data.name)
    } catch (err) {
      setMessage(err.message)
    }
  }

  return (
    <aside className="admin card">
      <h3>Admin</h3>
      <form onSubmit={add}>
        <input value={name} onChange={e => setName(e.target.value)} placeholder="Name" />
        <input value={category} onChange={e => setCategory(e.target.value)} placeholder="Category" />
        <input value={price} onChange={e => setPrice(e.target.value)} placeholder="Price" />
        <input value={quantity} onChange={e => setQuantity(e.target.value)} placeholder="Quantity" />
        <button type="submit">Add Sweet</button>
      </form>
      {message ? <div className="message">{message}</div> : null}
    </aside>
  )
}
