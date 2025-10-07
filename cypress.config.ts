import { defineConfig } from 'cypress'
import { createStaleEvent } from './cypress/helperFunctions'

export default defineConfig({
    e2e: {
        setupNodeEvents(on, config) {
            // implement node event listeners here
            on('task', {
                async performEventCreation() {
                    await createStaleEvent()
                    return null // You can return data if needed
                },
            })
        },
    },

    component: {
        devServer: {
            framework: 'next',
            bundler: 'webpack',
        },
    },
})
