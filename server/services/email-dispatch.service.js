const MAX_ATTEMPTS = 3;
const RETRY_DELAYS_MS = [0, 2_000, 10_000];

const delay = (milliseconds) =>
  new Promise((resolve) => {
    const timer = setTimeout(resolve, milliseconds);
    timer.unref?.();
  });

const dispatchEmail = (label, sendEmail) => {
  setImmediate(async () => {
    for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt += 1) {
      try {
        if (RETRY_DELAYS_MS[attempt - 1]) {
          await delay(RETRY_DELAYS_MS[attempt - 1]);
        }
        await sendEmail();
        return;
      } catch (error) {
        console.error(`[email:${label}] intento ${attempt}/${MAX_ATTEMPTS} fallido`, {
          code: error.code,
          responseCode: error.responseCode,
          message: error.message,
        });
      }
    }
  });
};

module.exports = { dispatchEmail };
