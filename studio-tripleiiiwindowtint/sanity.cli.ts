import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  studioHost: 'tripleiiiwindowtint',
  api: {
    projectId: 'o7039w6t',
    dataset: 'production'
  },
  deployment: {
    appId: 'jwlvhi5z6b3vk1i9c7i8pggp',
    /**
     * Enable auto-updates for studios.
     * Learn more at https://www.sanity.io/docs/studio/latest-version-of-sanity#k47faf43faf56
     */
    autoUpdates: true,
  },
})
