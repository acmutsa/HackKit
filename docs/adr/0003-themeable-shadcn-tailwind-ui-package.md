# Ship a themeable shadcn/Tailwind HackKit UI package

HackKit UI will ship styled React components built on shadcn/Radix/Tailwind conventions rather than a purely headless component layer. Applications remain responsible for global theme tokens in `global.css`, so HackKit UI components inherit the host app’s look while providing polished defaults. We accept Tailwind/shadcn coupling to make generated HackKit apps useful out of the box.
