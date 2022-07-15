const timeout = false;

const withInterval = (func, interval) => {
  if (!timeout) {
    func();
    timeout = true;
    setTimeout(() => { timeout = false; }, interval);
  }
};

export default withInterval;
