const {spawn} = require('child_process');

function pulsarProcess(env, ...args) {
  const atomBinPath = process.env.PULSAR_SCRIPT_PATH || process.env.ATOM_SCRIPT_PATH || 'pulsar';
  const atomEnv = {...process.env, ...env};
  const isWindows = process.platform === 'win32';

  return new Promise((resolve, reject) => {
    let settled = false;

    const child = spawn(atomBinPath, args, {
      env: atomEnv,
      stdio: 'inherit',
      shell: isWindows,
      windowsHide: true,
    });

    child.on('error', err => {
      if (!settled) {
        settled = true;
        reject(err);
      } else {
        // eslint-disable-next-line no-console
        console.error(`Unexpected subprocess error:\n${err.stack}`);
      }
    });

    child.on('exit', (code, signal) => {
      if (!settled) {
        settled = true;
        resolve({code, signal});
      }
    });
  });
}

async function runPulsar(...args) {
  try {
    const {code, signal} = await pulsarProcess(...args);
    if (signal) {
      // eslint-disable-next-line no-console
      console.log(`Atom process killed with signal ${signal}.`);
    }
    process.exit(code !== null ? code : 1);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err.stack);
    process.exit(1);
  }
}

module.exports = {
  pulsarProcess,
  runPulsar,
};
