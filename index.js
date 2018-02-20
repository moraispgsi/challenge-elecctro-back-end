require("babel-core").transform("code", {
  presets: ["babel-preset-flow"]
});
require("babel-polyfill");
require('./lib/index');