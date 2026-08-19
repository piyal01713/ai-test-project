#!/bin/bash

# Navigate to the project root
cd /home/peea/Documents/Lynk

# Create directories
mkdir -p frontend/src/{app,components,hooks,lib,styles,types}
mkdir -p frontend/public

# 1. package.json
cat << 'EOF' > frontend/package.json
{
  "name": "lynk-frontend",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "test": "vitest"
  },
  "dependencies": {
    "next": "^15.0.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0"
  },
  "devDependencies": {
    "@testing-library/dom": "^10.4.0",
    "@testing-library/react": "^16.0.0",
    "@types/node": "^20",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "@vitejs/plugin-react": "^4.3.0",
    "eslint": "^8",
    "eslint-config-next": "^15.0.0",
    "jsdom": "^25.0.0",
    "typescript": "^5",
    "vitest": "^2.1.0"
  }
}
EOF

# 2. tsconfig.json
cat << 'EOF' > frontend/tsconfig.json
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
EOF

# 3. next.config.ts
cat << 'EOF' > frontend/next.config.ts
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
};

export default nextConfig;
EOF

# 4. vitest.config.ts
cat << 'EOF' > frontend/vitest.config.ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/lib/test-setup.ts',
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
EOF

# 5. test-setup.ts
cat << 'EOF' > frontend/src/lib/test-setup.ts
import '@testing-library/react';
EOF

# 6. src/styles/tokens.css
cat << 'EOF' > frontend/src/styles/tokens.css
:root {
  /* Colors - Light Mode */
  --color-bg-primary: #FAFAF9;
  --color-bg-secondary: #F5F5F4;
  --color-bg-elevated: #FFFFFF;
  --color-text-primary: #1C1917;
  --color-text-secondary: #44403C;
  --color-text-muted: #78716C;
  --color-accent: #3B82F6;
  --color-accent-hover: #2563EB;
  --color-success: #10B981;
  --color-error: #EF4444;
  --color-border: #E7E5E4;

  /* Spacing */
  --space-xs: 4px;
  --space-sm: 8px;
  --space-md: 12px;
  --space-lg: 16px;
  --space-xl: 24px;
  --space-2xl: 32px;
  --space-3xl: 48px;
  --space-4xl: 64px;

  /* Typography */
  --font-family: 'Inter', system-ui, -apple-system, sans-serif;
  --font-mono: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  
  --text-xs: 0.75rem;
  --text-sm: 0.875rem;
  --text-base: 1rem;
  --text-lg: 1.125rem;
  --text-xl: 1.25rem;
  --text-2xl: 1.5rem;
  --text-3xl: 1.875rem;

  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;

  /* Radii */
  --radius-sm: 6px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-full: 9999px;

  /* Shadows */
  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);

  /* Transitions */
  --transition-fast: 150ms cubic-bezier(0.4, 0, 0.2, 1);
  --transition-normal: 300ms cubic-bezier(0.4, 0, 0.2, 1);
  --transition-slow: 500ms cubic-bezier(0.4, 0, 0.2, 1);
}

[data-theme="dark"] {
  /* Colors - Dark Mode */
  --color-bg-primary: #18181B;
  --color-bg-secondary: #27272A;
  --color-bg-elevated: #3F3F46;
  --color-text-primary: #F4F4F5;
  --color-text-secondary: #D4D4D8;
  --color-text-muted: #A1A1AA;
  --color-accent: #60A5FA;
  --color-accent-hover: #93C5FD;
  --color-border: #3F3F46;
}
EOF

# 7. src/app/globals.css
cat << 'EOF' > frontend/src/app/globals.css
@import '../styles/tokens.css';

*, *::before, *::after {
  box-sizing: border-box;
}

body {
  margin: 0;
  padding: 0;
  font-family: var(--font-family);
  background-color: var(--color-bg-primary);
  color: var(--color-text-primary);
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  transition: background-color var(--transition-normal), color var(--transition-normal);
}

h1, h2, h3, h4, h5, h6 {
  margin: 0;
  font-weight: var(--font-weight-semibold);
  line-height: 1.2;
}

h1 {
  font-size: var(--text-3xl);
  letter-spacing: -0.02em;
}

a {
  color: inherit;
  text-decoration: none;
}

button {
  font-family: inherit;
  cursor: pointer;
  border: none;
  background: none;
}
EOF

# 8. src/app/layout.tsx
cat << 'EOF' > frontend/src/app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Lynk - Local File Transfer',
  description: 'Fast, secure, drag-and-drop file transfers over your local network.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="light">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}
EOF

# 9. src/app/page.tsx
cat << 'EOF' > frontend/src/app/page.tsx
export default function Home() {
  return (
    <main style={{ padding: 'var(--space-2xl)', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>Lynk</h1>
      <p style={{ color: 'var(--color-text-secondary)', marginTop: 'var(--space-md)' }}>
        Your local network file transfer application.
      </p>
      
      <div style={{
        marginTop: 'var(--space-xl)',
        padding: 'var(--space-2xl)',
        border: '2px dashed var(--color-border)',
        borderRadius: 'var(--radius-lg)',
        textAlign: 'center',
        backgroundColor: 'var(--color-bg-secondary)'
      }}>
        <h2>Drag and drop files here</h2>
        <p style={{ color: 'var(--color-text-muted)' }}>or click to select files</p>
      </div>
    </main>
  );
}
EOF

# 10. README.md update
cat << 'EOF' > README.md
# Lynk — Product Specification

> **Lynk** is a production-grade, browser-based LAN file transfer application.

## Development Setup

The repository is structured as a monorepo with separate `frontend` and `backend` applications.

### Frontend
The frontend is built with Next.js 15, React 19, and vanilla CSS.

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:3000`.

4. Run tests:
   ```bash
   npm run test
   ```

### Backend
*(Instructions for backend will go here)*
EOF

echo "Frontend scaffolding complete!"
echo "Next steps:"
echo "1. cd frontend"
echo "2. npm install"
echo "3. npm run dev"
