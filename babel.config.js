module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    [
      '@babel/plugin-transform-class-properties',
      { loose: true }, // Add this to enable loose mode
    ],
    [
      '@babel/plugin-transform-private-methods',
      { loose: true }, // Add this to enable loose mode
    ],
    [
      '@babel/plugin-transform-private-property-in-object',
      { loose: true }, // Add this to enable loose mode
    ],
    '@babel/plugin-transform-runtime',
  ],
};
