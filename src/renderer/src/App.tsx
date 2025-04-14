import {
  ArduinoInfoArea,
  Content,
  EventInfoArea,
  RootLayout,
  Sidebar,
  TrialActions,
  TrialInfoArea,
  TrialInputs,
  TrialLogArea,
  VideoInfoArea
} from '@/components'
import { useArduinoListener, useLogListener } from '@/hooks'

export default function App() {
  useArduinoListener()
  useLogListener()

  return (
    <RootLayout>
      <Sidebar className="flex flex-col bg-neutral-900 p-2">
        <TrialInputs />
        <TrialActions />
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
  )
}
