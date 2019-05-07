

module.exports = pandora => {
  pandora
    .fork('api-gateway', './dist/main.js')

  /**
   * you can also use cluster mode to start application
   */
  // pandora
  //   .cluster('./dist/main.js');

  /**
   * you can create another process here
   */
  // pandora
  //   .process('background')
  //   .nodeArgs(['--expose-gc']);

  /**
   * more features please visit our document.
   * https://github.com/midwayjs/pandora/
   */
}
