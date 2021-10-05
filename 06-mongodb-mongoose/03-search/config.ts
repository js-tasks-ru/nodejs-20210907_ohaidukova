export default {
  mongodb: {
    uri:
      process.env.NODE_ENV === 'test'
        ? 'mongodb://localhost/6-module-3-task'
        : 'mongodb://localhost/shop',
  },
};
