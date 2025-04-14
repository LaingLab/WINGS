import {
  ArduinoInfoArea,
  Content,
  EventInfoArea,
  RootLayout,
  Sidebar,
  TrialActions,
  TrialInfoArea,
  TrialInputs,
  VideoInfoArea
} from '@/components'

export default function App() {
  return (
    <RootLayout>
      <Sidebar className="flex flex-col bg-neutral-900 p-2">
        <TrialInputs />
        <TrialActions />
      </Sidebar>
      <Content className="flex flex-col border-l border-l-white/20">
        <TrialInfoArea />
        <VideoInfoArea />
        <EventInfoArea />
        <ArduinoInfoArea />
      </Content>
    </RootLayout>
  )
}
