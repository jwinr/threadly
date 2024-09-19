'use client'

import { LegacyConfig, AmplifyOutputs } from 'aws-amplify/adapter-core'
import config from 'src/amplifyconfiguration.json'
import { Amplify, ResourcesConfig } from 'aws-amplify'

Amplify.configure(config as ResourcesConfig | LegacyConfig | AmplifyOutputs, {
  ssr: true,
})

const AmplifyConfig = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>
}

export default AmplifyConfig
