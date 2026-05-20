# Make HackKit UI Next.js-first

HackKit UI will target Next.js App Router first while remaining ordinary React components where practical. Interactive components will declare `"use client"` themselves, and integration examples will assume Next server actions and app-level `global.css` theme tokens. We accept this framework bias because HackKit's primary generated application target is Next.js.
