import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

const TICK_MS = 100

function buildSegments({ rounds, workSeconds, restSeconds }) {
  const segments = []
  for (let round = 1; round <= rounds; round += 1) {
    segments.push({ type: 'work', round, ms: workSeconds * 1000 })
    if (round < rounds && restSeconds > 0) {
      segments.push({ type: 'rest', round, ms: restSeconds * 1000 })
    }
  }
  return segments
}

// Countdown logic only; no presentation. Remaining time is derived from a
// clock deadline rather than counted ticks, so it never drifts.
export function useIntervalTimer({ rounds, workSeconds, restSeconds }) {
  const segments = useMemo(
    () => buildSegments({ rounds, workSeconds, restSeconds }),
    [rounds, workSeconds, restSeconds],
  )
  const [status, setStatus] = useState('ready') // ready | running | paused | complete
  const [index, setIndex] = useState(0)
  const [remainingMs, setRemainingMs] = useState(segments[0].ms)
  const indexRef = useRef(0)
  const endAtRef = useRef(0)

  useEffect(() => {
    if (status !== 'running') return undefined

    const id = setInterval(() => {
      const now = performance.now()
      let i = indexRef.current
      let remaining = endAtRef.current - now

      while (remaining <= 0) {
        if (i >= segments.length - 1) {
          indexRef.current = i
          setIndex(i)
          setRemainingMs(0)
          setStatus('complete')
          return
        }
        i += 1
        endAtRef.current += segments[i].ms
        remaining = endAtRef.current - now
      }

      if (i !== indexRef.current) {
        indexRef.current = i
        setIndex(i)
      }
      setRemainingMs(remaining)
    }, TICK_MS)

    return () => clearInterval(id)
  }, [status, segments])

  const start = useCallback(() => {
    if (status !== 'ready' && status !== 'paused') return
    endAtRef.current = performance.now() + remainingMs
    setStatus('running')
  }, [status, remainingMs])

  const pause = useCallback(() => {
    if (status === 'running') setStatus('paused')
  }, [status])

  const reset = useCallback(() => {
    indexRef.current = 0
    setIndex(0)
    setRemainingMs(segments[0].ms)
    setStatus('ready')
  }, [segments])

  const segment = segments[index]
  const nextSegment = segments[index + 1] ?? null
  const completedMs = segments.slice(0, index).reduce((sum, s) => sum + s.ms, 0)
  const elapsedMs = completedMs + (segment.ms - remainingMs)

  return {
    status,
    segment,
    nextSegment,
    segmentIndex: index,
    totalRounds: rounds,
    remainingMs,
    progress: remainingMs / segment.ms,
    elapsedMs,
    start,
    pause,
    reset,
  }
}
