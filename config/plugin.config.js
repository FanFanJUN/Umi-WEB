
export default (config) => {
  // optimize chunks
  config.output
    .filename('[name].[hash].js');
};
