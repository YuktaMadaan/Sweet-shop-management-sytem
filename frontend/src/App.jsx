import React, { useState, useEffect } from 'react'
import Login from './components/Login'
import Register from './components/Register'
import Sweets from './components/Sweets'
import AdminPanel from './components/AdminPanel'

export default function App() {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('user'))
    } catch {
      return null
    }
  })
  const [token, setToken] = useState(() => localStorage.getItem('token'))

  useEffect(() => {
    if (token) localStorage.setItem('token', token)
    else localStorage.removeItem('token')
  }, [token])

  useEffect(() => {
    if (user) localStorage.setItem('user', JSON.stringify(user))
    else localStorage.removeItem('user')
  }, [user])

  const logout = () => {
    setUser(null)
    setToken(null)
  }

  return (
    <div className="container">
      <header>
        <h1>Sweet Shop</h1>
        {user ? (
          <div>
            <span>Welcome, {user.name} {user.isAdmin ? '(Admin)' : ''}</span>
            <button onClick={logout}>Logout</button>
          </div>
        ) : null}
      </header>

      <main>
        {!user ? (
          <div className="auth">
            <Login setUser={setUser} setToken={setToken} />
            <Register setUser={setUser} setToken={setToken} />
          </div>
        ) : (
          <>
            <Sweets token={token} />
            {user.isAdmin ? <AdminPanel token={token} /> : null}
          </>
        )}
      </main>
    </div>
  )
}
