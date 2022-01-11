const sleep = async time => {
  await new Promise(res => setTimeout(res, time));
};

export default sleep;
