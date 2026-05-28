import { useState, FormEvent } from 'react'
import { supabase } from '@/lib/supabase'

interface LoginProps {
  onLogin: () => void
}

export default function Login({ onLogin }: LoginProps) {
  const [email, setEmail] = useState('')
  const [pw, setPw] = useState('')
  const [err, setErr] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    setErr('')
    setLoading(true)
    if (!supabase) {
      setErr('Supabase non configurato. Aggiungi le variabili d\'ambiente.')
      setLoading(false)
      return
    }
    const { error } = await supabase.auth.signInWithPassword({ email, password: pw })
    setLoading(false)
    if (error) setErr(error.message)
    else onLogin()
  }

  return (
    <div className="login-screen">
      <form className="login-card" onSubmit={submit}>
        <div className="login-logo">MAYO</div>
        <div className="login-sub">Area Riservata · Admin</div>
        <label className="login-label" htmlFor="email">Email</label>
        <input
          id="email"
          className="inp"
          type="email"
          value={email}
          autoFocus
          onChange={(e) => { setEmail(e.target.value); setErr('') }}
          placeholder="admin@mayo.it"
          style={{ marginBottom: 14 }}
        />
        <label className="login-label" htmlFor="pw">Password</label>
        <input
          id="pw"
          className="inp"
          type="password"
          value={pw}
          onChange={(e) => { setPw(e.target.value); setErr('') }}
          placeholder="••••••••"
        />
        {err && <div className="login-error">{err}</div>}
        <button className="btn-save" style={{ width: '100%', marginTop: 24 }} type="submit" disabled={loading}>
          {loading ? 'ACCESSO…' : 'ENTRA →'}
        </button>
      </form>
    </div>
  )
}
