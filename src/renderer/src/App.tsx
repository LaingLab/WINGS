import {
  ArduinoInfoArea,
  BottomTrialActions,
  Content,
  DebugPage,
  EventInfoArea,
  RootLayout,
  Sidebar,
  TrialInfoArea,
  TrialInputs,
  TrialLogArea,
  VideoInfoArea
} from '@/components'
import { useArduinoListener, useLogListener, useTrial } from '@/hooks'
import { Route, BrowserRouter as Router, Routes } from 'react-router'

export default function App() {
  useArduinoListener()
  useLogListener()
  useTrial()

  return (
    <ReactRouter>
      <RootLayout>
        <Sidebar className="flex flex-col bg-neutral-900 p-2">
          <TrialInputs />
          <BottomTrialActions />
        </Sidebar>
        <Content className="flex flex-col border-l border-l-white/20">
          <TrialInfoArea />
          <VideoInfoArea />
          <ArduinoInfoArea />
          <TrialLogArea />
        </Content>
        <Sidebar className="flex flex-col bg-neutral-900">
          <EventInfoArea />
        </Sidebar>
      </RootLayout>
    </ReactRouter>
  )
}

function ReactRouter({ children }) {
  return (
    <Router>
      <Routes>
        <Route path="/" element={children} />
        <Route path="/debug" element={<DebugPage />} />
      </Routes>
    </Router>
  )
}
