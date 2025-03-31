interface Window {
  electronIPC: {
    sendFrameAction: (payload: any) => void;
    recording: (type: string, params?: any) => any;
    arduino: (type: string, params?: any) => any;
    io: (type: string, params?: any) => any;
    testInvoke: (params: any) => void;
    testSend: (params: any) => void;
    testOn: (callback: any) => void;
  };
}
