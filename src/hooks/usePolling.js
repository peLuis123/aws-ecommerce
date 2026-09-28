import { useEffect, useState } from 'react'

export function usePolling(fetcher, { enabled = true, interval = 2500, timeout = 60000, isDone }) {
  const [state, setState] = useState({ status: enabled ? 'loading' : 'idle', data: null, error: null })

  useEffect(() => {
    if (!enabled) return undefined

    let active = true
    const startedAt = Date.now()
    let timer

    const poll = async () => {
      try {
        const data = await fetcher()
        if (!active) return
        if (isDone(data) || Date.now() - startedAt >= timeout) {
          setState({ status: isDone(data) ? 'success' : 'timeout', data, error: null })
          return
        }
        setState({ status: 'pending', data, error: null })
        timer = window.setTimeout(poll, interval)
      } catch (error) {
        if (active) setState({ status: 'error', data: null, error })
      }
    }

    poll()
    return () => {
      active = false
      window.clearTimeout(timer)
    }
  }, [enabled, fetcher, interval, isDone, timeout])

  return state
}
