import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '../api'

const defaults = { title: '', description: '', category: 'other', status: 'lost', location: '' }

export default function ItemForm() {
  const nav = useNavigate()
  const { id } = useParams()
  const [form, setForm] = useState(defaults)
  const [error, setError] = useState('')

  // Edit mode: load the existing item and fill the form
  useEffect(() => {
    if (!id) return
    api
      .get(`/items/${id}`)
      .then((res) => {
        const item = res.data.item
        setForm({
          title: item.title ?? '',
          status: item.status ?? 'lost',
          category: item.category ?? 'other',
          location: item.location ?? '',
          description: item.description ?? '',
        })
      })
      .catch((err) => {
        setError(err.response?.data?.message || 'Could not load the item')
      })
  }, [id])

  // Every input has a `name` matching a key in `form`
  function onChange(e) {
    const { name, value } = e.target
    setForm((f) => ({ ...f, [name]: value }))
  }

  // POST when reporting, PATCH when editing
  async function onSubmit(e) {
    e.preventDefault()
    setError('')
    try {
      if (id) {
        await api.patch(`/items/${id}`, form)
      } else {
        await api.post('/items', form)
      }
      nav('/items')
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong')
    }
  }

  return (
    <div className="max-w-lg mx-auto card">
      <h1 className="text-xl font-semibold mb-4">{id ? 'Edit' : 'Report'} Item</h1>
      <form onSubmit={onSubmit} className="space-y-3">
        <div>
          <label htmlFor="title" className="block text-sm mb-1">Title</label>
          <input
            id="title"
            name="title"
            type="text"
            value={form.title}
            onChange={onChange}
            placeholder="Black backpack"
            className="border rounded px-2 py-1 w-full"
          />
        </div>

        <div>
          <label htmlFor="status" className="block text-sm mb-1">Status</label>
          <select
            id="status"
            name="status"
            value={form.status}
            onChange={onChange}
            className="border rounded px-2 py-1 w-full"
          >
            <option value="lost">lost</option>
            <option value="found">found</option>
            <option value="claimed">claimed</option>
          </select>
        </div>

        <div>
          <label htmlFor="category" className="block text-sm mb-1">Category</label>
          <select
            id="category"
            name="category"
            value={form.category}
            onChange={onChange}
            className="border rounded px-2 py-1 w-full"
          >
            <option value="electronics">electronics</option>
            <option value="clothing">clothing</option>
            <option value="documents">documents</option>
            <option value="accessories">accessories</option>
            <option value="other">other</option>
          </select>
        </div>

        <div>
          <label htmlFor="location" className="block text-sm mb-1">Location</label>
          <input
            id="location"
            name="location"
            type="text"
            value={form.location}
            onChange={onChange}
            placeholder="Library 2nd floor"
            className="border rounded px-2 py-1 w-full"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm mb-1">Description</label>
          <textarea
            id="description"
            name="description"
            value={form.description}
            onChange={onChange}
            rows={4}
            className="border rounded px-2 py-1 w-full"
          />
        </div>

        {error && <div className="text-red-600 text-sm">{error}</div>}
        <button className="btn" type="submit">Save</button>
      </form>
    </div>
  )
}