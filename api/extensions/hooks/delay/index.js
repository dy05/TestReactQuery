function wait (duration) {
  return new Promise(resolve => setTimeout(resolve, duration))
}

module.exports = ({ filter }) => {
  filter('items.read', async (input) => {
    await wait(2000)
    return input;
  });
  filter('items.update', async (input) => {
    if (input.title === 'err') {
      await wait(2000)
      throw new Error('wtf happened')
    }
    return input;
  });
};
