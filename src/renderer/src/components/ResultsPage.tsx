import { ArrowLeft } from 'lucide-react'
import { Link } from 'react-router'

function ResultsPage() {
  return (
    <div className="flex h-full gap-1 p-3">
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <Link
            to="/"
            className="rounded-full bg-white p-1 text-black duration-150 hover:bg-white/50"
          >
            <ArrowLeft size={22} />
          </Link>
          <h1 className="text-3xl font-medium">Results</h1>
        </div>

        <p>Video</p>
        <p>Events</p>
        <p>Sensor Readings</p>
      </div>
    </div>
  )
}

export default ResultsPage
