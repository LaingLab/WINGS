import { Route, BrowserRouter as Router, Routes } from 'react-router'
import { DebugPage, HomePage, ResultsPage, TrialPage } from './pages'

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/trial/:id" element={<TrialPage />} />
        <Route path="/debug/:id" element={<DebugPage />} />
        <Route path="/results/:id" element={<ResultsPage />} />
      </Routes>
    </Router>
  )
}
