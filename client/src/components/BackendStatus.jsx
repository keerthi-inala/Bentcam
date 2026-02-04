import React, { useEffect, useRef, useState } from 'react'

const BackendStatus = () => {
  const [online, setOnline] = useState(true)
  const [checking, setChecking] = useState(false)
  const timerRef = useRef(null)

  const check = async () => {
    try {
      setChecking(true)
      const res = await fetch('/api/health', { method: 'GET' })
      setOnline(res.ok)
    } catch (_) {
      setOnline(false)
    } finally {
      setChecking(false)
    }
  }

  useEffect(() => {
    check()
    timerRef.current = setInterval(check, 15000)
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [])

  if (online) return null

  return (
    <div className="alert alert-warning text-center py-2 mb-0" role="alert">
      Backend appears offline (http://localhost:8080). Some images/data may not load.
      <button className="btn btn-sm btn-outline-dark ms-3" onClick={check} disabled={checking}>
        {checking ? 'Checking…' : 'Retry'}
      </button>
    </div>
  )
}

export default BackendStatus
