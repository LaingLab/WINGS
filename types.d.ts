interface Window {
  electronIPC: {
    sendFrameAction: (payload: any) => void;
    recording: (type: string, params?: any) => void;
    testInvoke: (params: any) => void;
    testSend: (params: any) => void;
    testOn: (callback: any) => void;
  };
}
