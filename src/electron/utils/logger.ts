export function log(message: string, ...args: any[]) {
  console.log(`| ${message}`, ...args);
  return `| ${message}`;
}

export function fnLog(message: string, ...args: any[]) {
  console.log(`\n> ${message}`, ...args);
  return `> ${message}`;
}

export function success(message: string, data?: any) {
  console.log(`* ${message} `);
  return {
    status: 1,
    message: `* ${message}`,
    data: data !== undefined ? JSON.parse(JSON.stringify(data)) : null,
  };
}

export function error(message: string, error?: any) {
  if (error) {
    console.error(`!! ${message} `, error);
    return { status: 0, message: `!! ${message} - ${error}`, data: null };
  }
  console.error(`!! ${message} `);
  return { status: 0, message: `!! ${message}`, data: null };
}

export function trialLog(message: string, ...args: any[]) {
  console.log(`\n> ${message}`, ...args);
  return `> ${message}`;
}
