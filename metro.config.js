const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

// Optimize for smaller bundle size
config.transformer.minifierConfig = {
  keep_fnames: true,
  mangle: {
    keep_fnames: true,
  },
};

// Enable tree shaking
config.resolver.platforms = ["native", "android", "ios", "web"];

// Exclude unnecessary files from bundle
config.resolver.blockList = [
  /docs\/.*/,
  /landing-page\/.*/,
  /\.git\/.*/,
  /node_modules\/.*\/README\.md/,
  /node_modules\/.*\/CHANGELOG\.md/,
  /node_modules\/.*\/LICENSE/,
];

module.exports = config;
