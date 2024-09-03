'use client'

import config from '../src/amplifyconfiguration.json'
import { Amplify } from 'aws-amplify'

Amplify.configure(config, {
  ssr: true,
})

const AmplifyConfig = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>
}

export default AmplifyConfig
