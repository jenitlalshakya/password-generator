# Password Generator

A lightweight, client-side password generator built with Next.js, TypeScript, and Tailwind CSS. Passwords are generated entirely in the browser — nothing is stored or sent to a server.

## Features

- Random secure passwords using `crypto.getRandomValues`
- Adjustable length (4–64, default 8) via slider and number input
- Character type checkboxes: uppercase, lowercase, numbers, symbols
- At least one character type required; warning shown and generate disabled when none selected
- Copy to clipboard
- Password strength indicator (weak → strong)
- Responsive, minimal UI with dark mode support

## Project structure

```
password-generator/
├── app/
│   ├── globals.css          # Tailwind + theme variables
│   ├── layout.tsx           # Root layout and metadata
│   └── page.tsx             # Home page
├── components/
│   └── PasswordGenerator.tsx # Main UI (client component)
├── lib/
│   ├── constants.ts         # Length limits and character sets
│   ├── password.ts          # Generation logic
│   ├── strength.ts          # Strength scoring
│   └── types.ts             # Shared TypeScript types
└── public/
```

## Setup (pnpm)

Dependencies are already included in the scaffold. Install and run:

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

### Production build

```bash
pnpm build
pnpm start
```

## Implementation notes

- **Arrow functions only**: All functions use `const name = () => {}` syntax (components, handlers, utilities).
- **Checkbox logic**: `hasSelection` is derived from options state. The generate button is `disabled` when no type is selected, and an alert explains why.
- **Secure randomness**: `generatePassword` uses `crypto.getRandomValues` and Fisher–Yates shuffle. Each selected character set contributes at least one character when possible.
- **No backend**: The app is a single client component with no API routes or persistence.
