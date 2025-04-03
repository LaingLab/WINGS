export function connect() {
  window.electronIPC.arduino("connect", null);
}

export function disconnect() {
  window.electronIPC.arduino("disconnect", null);
}

export function prime() {
  window.electronIPC.arduino("prime", null);
}

export function unprime() {
  window.electronIPC.arduino("unprime", null);
}
