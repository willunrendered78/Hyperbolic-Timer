export default function TagChip({ name, selected = false, onToggle }) {
  if (!onToggle) return <span className="tag-chip">{name}</span>
  return (
    <button
      type="button"
      className="tag-chip tag-chip--toggle"
      aria-pressed={selected}
      onClick={onToggle}
    >
      {name}
    </button>
  )
}
