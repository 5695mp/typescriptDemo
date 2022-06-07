// eslint-disable-next-line func-names
module.exports = function (api) {
  api.cache(true)
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./'],
          alias: {
            '@screens': './src/screens',
            '@views': './src/views',
            '@components': './src/components',
            '@utils': './src/utils',
            '@config': './src/config',
            '@assets': './assets',
            '@redux': './src/redux',
            '@navigation': './src/navigation',
            '@styles': './src/styles',
          },
        },
      ],
      'react-native-reanimated/plugin',
    ],
  }
}
