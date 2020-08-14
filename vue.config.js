module.exports = {
  chainWebpack: (config) => {
    config.resolve.alias
      .set('@', resolve('src'))
      .set('views', resolve('src/views'))
      .set('store', resolve('src/store'))
      .set('components', resolve('src/components'))
  }
}
