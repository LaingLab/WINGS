import { X } from 'lucide-react'
import ReactDOM from 'react-dom'

export const Modal = ({
  open,
  children,
  onClose
}: {
  open: boolean
  children: any
  onClose: any
}) => {
  if (!open) return null

  return ReactDOM.createPortal(
    <>
      <div className="fixed inset-0 z-50 bg-black/75"></div>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-10">
        <div className="relative h-fit w-100 rounded-xl border border-white/20 bg-neutral-950 p-2 text-white">
          <button
            onClick={onClose}
            className="absolute right-2 rounded-full border border-white/20 bg-neutral-800 p-1 duration-150 hover:bg-neutral-900"
          >
            <X size={16} />
          </button>
          {children}
        </div>
      </div>
    </>,
    document.getElementById('portal')!
  )
}
