module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',

  moduleNameMapper: {
    '^@api$': '<rootDir>/src/utils/burger-api.ts',
    '^@utils-types$': '<rootDir>/src/utils/types.ts',
    '^\\[club28538362\\|@slices\\]$': '<rootDir>/src/services/slices',
    '^\\[club13889449\\|@selectors\\]$': '<rootDir>/src/services/selectors',
    '^@ui$': '<rootDir>/src/components/ui',
    '^@ui-pages$': '<rootDir>/src/components/ui/pages',
    '^@pages$': '<rootDir>/src/pages',
    '^\\[club3536953\\|@components\\]$': '<rootDir>/src/components'
  },

  testPathIgnorePatterns: ['tests']
};