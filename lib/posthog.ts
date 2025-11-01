import posthog from 'posthog-js'

export const initPostHog = () => {
    if (typeof window === 'undefined') return // Don't run on the server

    if (process.env.NEXT_PUBLIC_POSTHOG_KEY && process.env.NEXT_PUBLIC_POSTHOG_HOST) {
        posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
            api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
            capture_pageview: true,
            capture_pageleave: true,
            debug: process.env.NODE_ENV === 'development', // optional
        })
    } else {
        console.warn('PostHog env vars missing!')
    }
}
