'use client' // 👈 required because PostHog runs in the browser

import { useEffect } from 'react'
import posthog from 'posthog-js'

export default function PostHogProvider() {
    useEffect(() => {
        if (process.env.NEXT_PUBLIC_POSTHOG_KEY && process.env.NEXT_PUBLIC_POSTHOG_HOST) {
            posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
                api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
                capture_pageview: true,
                capture_pageleave: true,
                debug: process.env.NODE_ENV === 'development', // Optional
            })
        } else {
            console.warn('⚠️ PostHog environment variables missing.')
        }
    }, [])

    return null // no visible UI
}
