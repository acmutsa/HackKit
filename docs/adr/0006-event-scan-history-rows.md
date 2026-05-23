# Store each Event Scan as its own row

HackKit Core records every Event Scan as a separate persisted row with its own identifier, rather than reusing the legacy pattern of one row per user and event with an incrementing count. Volunteers still see prior scans for the same user at an event and receive a warning before confirming another scan, but Core always appends scan history. Hackathon Check-in remains a one-time `checkedInAt` timestamp on User, separate from Event Scan history.
