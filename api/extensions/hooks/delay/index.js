function wait (duration) {
  return new Promise(resolve => setTimeout(resolve, duration))
}

module.exports = ({ filter }) => {
  filter('items.read', async (input) => {
    await wait(2000)
    return input;
  });
};
