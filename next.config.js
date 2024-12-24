/** @type {import('next').NextConfig} */
require("dotenv").config({ path: `${process.env.ENV_FILE}` })

const dotenv = {
	env: {},
	serverRuntimeConfig: {
		ENVIRONMENT: process.env.ENVIRONMENT,
	},
	publicRuntimeConfig: {
		ENVIRONMENT: process.env.ENVIRONMENT,
	},
}

module.exports = {
  reactStrictMode: true,
  ...dotenv,
  output: 'standalone',
    webpack: (config) => {
    config.module.rules.push({
      test: /\.tsx/,
      use: [
        {
          loader: 'webpack-strip-code',
          options: {
            choiceArray: [
              {
                start: 'start-test-block',
                end: 'end-test-block'
              },
            ]
          }
        }
      ]
    })

    return config
  },
};
