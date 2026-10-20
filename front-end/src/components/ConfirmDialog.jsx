import './confirm.css'
import { useEffect, useRef } from 'react'

export default function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel,
  cancelLabel = 'Stay',
  onConfirm,
  onCancel,
}) {
  const ref = useRef(null)

  useEffect(() => {
    const dialog = ref.current
    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
  }, [open])

  return (
    <dialog
      ref={ref}
      className="confirm"
      aria-labelledby="confirm-title"
      onCancel={(event) => {
        event.preventDefault()
        onCancel()
      }}
    >
      <h2 id="confirm-title" className="confirm__title">{title}</h2>
      <p className="confirm__message">{message}</p>
      <div className="confirm__actions">
        <button type="button" className="btn btn--secondary" onClick={onCancel}>
          {cancelLabel}
        </button>
        <button type="button" className="btn btn--danger" onClick={onConfirm}>
          {confirmLabel}
        </button>
      </div>
    </dialog>
  )
}
