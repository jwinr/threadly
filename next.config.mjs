/** @type {import('next').NextConfig} */

export function webpack(config) {
  config.module.rules.push({
    test: /\.svg$/,
    use: ['@svgr/webpack'],
  })

  return config
}
export const compiler = {
  styledComponents: true,
}
