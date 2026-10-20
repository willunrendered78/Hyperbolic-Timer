export default function InlineError({ id, message }) {
  if (!message) return null
  return (
    <p id={id} className="inline-error" role="alert">
      {message}
    </p>
  )
}
