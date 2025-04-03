interface Window {
  electronIPC: {
    // Custom Methods
    io: (type: string, params?: any) => any;

    recording: (type: string, params?: any) => any;

    arduino: (type: string, params?: any) => any;
    onArduinoUpdate: (callback: any) => void;
    onArduinoLog: (callback: any) => void;

    // Frame Actions
    sendFrameAction: (payload: any) => void;

    // Default Methods
    testInvoke: (params: any) => void;
    testSend: (params: any) => void;
    testOn: (callback: any) => void;
  };
}
