"use client"

import React from "react"

// Pure CSS shiny button — no framer-motion CSS variable issues.
// All instances share the same @keyframes so they stay perfectly in sync.

interface ShinyButtonProps {
  children: React.ReactNode
  href: string
  target?: string
  rel?: string
}

export function ShinyButton({ children, href, target, rel }: ShinyButtonProps) {
  return (
    <a
      href={href}
      target={target}
      rel={rel}
      className="shiny-btn"
      style={{ textDecoration: "none" }}
    >
      <span className="shiny-btn__text">
        {children}
        <span className="shiny-btn__arrow" aria-hidden="true">
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1 9L9 1M9 1H3M9 1V7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </span>
      </span>
      <span className="shiny-btn__border" />
    </a>
  )
}
