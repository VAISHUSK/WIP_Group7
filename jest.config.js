module.exports = {
    preset: 'react-native',
    transform: {
      '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
    },
    moduleNameMapper: {
      '^firebase/(.*)$': '<rootDir>/__mocks__/firebase/$1',
    },
    transformIgnorePatterns: [
      'node_modules/(?!(react-native|@react-native|@react-navigation|@firebase|firebase|react-native-picker-select)/)',
    ],
    setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
    testEnvironment: "jsdom",
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    testPathIgnorePatterns: ['/node_modules/', '/android/', '/ios/'],
    setupFiles: ['./jest.setup.js'],
  };
  