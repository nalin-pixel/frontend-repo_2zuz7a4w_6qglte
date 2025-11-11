import { useEffect, useState } from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import Navbar from './components/Navbar'

const API_BASE = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

function Home() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900">LearnMate</h1>
        <p className="mt-4 text-gray-600">Learn, Practice, and Improve Your Knowledge</p>
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <MenuCard title="Courses" to="/courses" />
          <MenuCard title="Practice" to="/practice" />
          <MenuCard title="Quiz" to="/quiz" />
          <MenuCard title="Notes" to="/notes" />
          <MenuCard title="Profile" to="/profile" />
        </div>
      </div>
    </div>
  )
}

function MenuCard({ title, to }) {
  return (
    <Link to={to} className="block border rounded-lg p-6 hover:shadow-lg transition bg-white">
      <div className="text-lg font-semibold text-blue-700">{title}</div>
      <div className="text-sm text-gray-600">Open {title}</div>
    </Link>
  )
}

function Courses() {
  const [courses, setCourses] = useState([])
  useEffect(() => {
    fetch(`${API_BASE}/courses`).then(r => r.json()).then(setCourses).catch(() => setCourses([]))
  }, [])
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-4">Courses</h2>
      <div className="space-y-3">
        {courses.map((c, i) => (
          <div key={i} className="border rounded p-4 flex items-center justify-between bg-white">
            <div>
              <div className="font-semibold">{c.title}</div>
              <div className="text-sm text-gray-600">{c.subject}</div>
            </div>
            <button className="px-3 py-2 bg-blue-600 text-white rounded">Start Learning</button>
          </div>
        ))}
      </div>
    </div>
  )
}

function Practice() {
  const [message, setMessage] = useState('')
  const start = async () => {
    const r = await fetch(`${API_BASE}/practice/start`, { method: 'POST' })
    const j = await r.json()
    setMessage(j.message || 'Started')
  }
  const [history, setHistory] = useState([])
  useEffect(() => { fetch(`${API_BASE}/practice/history`).then(r=>r.json()).then(setHistory) }, [])
  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-4">
      <h2 className="text-2xl font-bold">Practice</h2>
      <button onClick={start} className="px-4 py-2 bg-blue-600 text-white rounded">Start Today</button>
      {message && <div className="text-green-700">{message}</div>}
      <div>
        <h3 className="font-semibold mb-2">History</h3>
        <ul className="list-disc pl-5 text-gray-700">
          {history.map((h,i)=>(<li key={i}>{h.date} — {h.status}</li>))}
        </ul>
      </div>
    </div>
  )
}

function Quiz() {
  const [questions, setQuestions] = useState([])
  const [answers, setAnswers] = useState([])
  const [result, setResult] = useState(null)
  useEffect(()=>{ fetch(`${API_BASE}/quiz/questions`).then(r=>r.json()).then(q=>{ setQuestions(q); setAnswers(Array(q.length).fill(-1)) }) }, [])
  const submit = async () => {
    const r = await fetch(`${API_BASE}/quiz/submit`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ answers }) })
    const j = await r.json(); setResult(j)
  }
  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      <h2 className="text-2xl font-bold">Quiz</h2>
      {questions.map((q, qi) => (
        <div key={qi} className="border rounded p-4 bg-white">
          <div className="font-medium">{q.text}</div>
          <div className="mt-2 space-y-2">
            {q.options.map((opt, oi)=> (
              <label key={oi} className="flex items-center gap-2">
                <input type="radio" name={`q-${qi}`} checked={answers[qi]===oi} onChange={()=>{
                  const a=[...answers]; a[qi]=oi; setAnswers(a)
                }} />
                <span>{opt}</span>
              </label>
            ))}
          </div>
        </div>
      ))}
      <button onClick={submit} className="px-4 py-2 bg-blue-600 text-white rounded">Submit</button>
      {result && <div className="text-green-700">You have completed the quiz! Score: {result.correct}/{result.total}</div>}
    </div>
  )
}

function Notes() {
  const [notes, setNotes] = useState([])
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const load = () => fetch(`${API_BASE}/notes`).then(r=>r.json()).then(setNotes)
  useEffect(()=>{ load() },[])
  const save = async () => {
    await fetch(`${API_BASE}/notes`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ title, content }) })
    setTitle(''); setContent(''); load()
  }
  const del = async (t) => { await fetch(`${API_BASE}/notes/${encodeURIComponent(t)}`, { method: 'DELETE' }); load() }
  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-4">
      <h2 className="text-2xl font-bold">Notes</h2>
      <div className="grid gap-2">
        <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Title" className="border rounded px-3 py-2" />
        <textarea value={content} onChange={e=>setContent(e.target.value)} placeholder="Content" className="border rounded px-3 py-2 min-h-[100px]" />
        <button onClick={save} className="self-start px-4 py-2 bg-blue-600 text-white rounded">Save</button>
      </div>
      <div className="space-y-3">
        {notes.map((n,i)=> (
          <div key={i} className="border rounded p-3 bg-white">
            <div className="font-semibold">{n.title}</div>
            <div className="text-gray-700 whitespace-pre-wrap">{n.content}</div>
            <button onClick={()=>del(n.title)} className="mt-2 text-sm text-red-600">Delete</button>
          </div>
        ))}
      </div>
    </div>
  )
}

function Profile() {
  const [profile, setProfile] = useState(null)
  const [form, setForm] = useState({ full_name: '', language: 'en', push_notifications: true })
  useEffect(()=>{ fetch(`${API_BASE}/profile`).then(r=>r.json()).then(p=>{ setProfile(p); setForm({ full_name: p.full_name||'', language: p.language||'en', push_notifications: p.push_notifications??true }) }) }, [])
  const save = async () => {
    await fetch(`${API_BASE}/profile`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
    const p = await (await fetch(`${API_BASE}/profile`)).json(); setProfile(p)
  }
  if (!profile) return <div className="max-w-3xl mx-auto px-4 py-8">Loading…</div>
  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-4">
      <h2 className="text-2xl font-bold">Profile</h2>
      <div className="grid gap-3">
        <input value={form.full_name} onChange={e=>setForm({...form, full_name:e.target.value})} placeholder="Full name" className="border rounded px-3 py-2" />
        <select value={form.language} onChange={e=>setForm({...form, language:e.target.value})} className="border rounded px-3 py-2">
          <option value="en">English</option>
          <option value="fr">French</option>
          <option value="es">Spanish</option>
        </select>
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={form.push_notifications} onChange={e=>setForm({...form, push_notifications: e.target.checked})} />
          <span>Enable notifications</span>
        </label>
        <button onClick={save} className="self-start px-4 py-2 bg-blue-600 text-white rounded">Save</button>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/practice" element={<Practice />} />
        <Route path="/quiz" element={<Quiz />} />
        <Route path="/notes" element={<Notes />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </div>
  )
}
