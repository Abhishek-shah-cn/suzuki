# Next.js Application

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/pages/api-reference/create-next-app).

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (version 14.x or higher)7.268 Attention: Next.js now collects completely anonymous telemetry regarding usage.
7.269 This information is used to shape Next.js' roadmap and prioritize features.
7.269 You can learn more, including how to opt-out if you'd not like to participate in this anonymous program, by visiting the following URL:
7.271 https://nextjs.org/telemetry
7.271 
7.514    ▲ Next.js 15.3.2
7.517 
8.184    Linting and checking validity of types ...
8.831    Creating an optimized production build ...
13.59  ⚠ Mismatching @next/swc version, detected: 14.1.0 while Next.js is on 15.3.2. Please ensure these match
17.88 Failed to compile.
17.88 
17.88 HookWebpackError: _webpack.WebpackError is not a constructor
17.88     at makeWebpackError (/app/node_modules/next/dist/compiled/webpack/bundle5.js:29:315788)
17.88     at /app/node_modules/next/dist/compiled/webpack/bundle5.js:29:106487
17.88     at eval (eval at create (/app/node_modules/next/dist/compiled/webpack/bundle5.js:14:9224), <anonymous>:58:1)
17.88 -- inner error --
17.88 TypeError: _webpack.WebpackError is not a constructor
17.88     at buildError (/app/node_modules/next/dist/build/webpack/plugins/minify-webpack-plugin/src/index.js:24:16)
17.88     at /app/node_modules/next/dist/build/webpack/plugins/minify-webpack-plugin/src/index.js:127:57
17.88     at async Span.traceAsyncFn (/app/node_modules/next/dist/trace/trace.js:157:20)
17.88 caused by plugins in Compilation.hooks.processAssets
17.88 TypeError: _webpack.WebpackError is not a constructor
17.88     at buildError (/app/node_modules/next/dist/build/webpack/plugins/minify-webpack-plugin/src/index.js:24:16)
17.88     at /app/node_modules/next/dist/build/webpack/plugins/minify-webpack-plugin/src/index.js:127:57
17.88     at async Span.traceAsyncFn (/app/node_modules/next/dist/trace/trace.js:157:20)
17.88 
18.00  ⚠ Mismatching @next/swc version, detected: 14.1.0 while Next.js is on 15.3.2. Please ensure these match
18.01 
18.01 > Build failed because of webpack errors
------
Dockerfile:17
--------------------
  15 |     
  16 |     # Build application with error handling
  17 | >>> RUN npm run build
  18 |     
  19 |     # Production stage
--------------------
ERROR: failed to solve: process "/bin/sh -c npm run build" did not complete successfully: exit code: 1
- npm, yarn, pnpm, or bun package manager

## Project Setup

1. Clone the repository:
```bash
git clone <your-repository-url>
cd <your-project-directory>
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

## Available Scripts

In the project directory, you can run:

```bash
# Start development server
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev

# Build the application
npm run build
# or
yarn build
# or
pnpm build
# or
bun build

# Start production server
npm run start
# or
yarn start
# or
pnpm start
# or
bun start

# Run linting
npm run lint
# or
yarn lint
# or
pnpm lint
# or
bun lint
```

## Development

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.js`. The page auto-updates as you edit the file.



## Features

- Next.js 13+ with Page Router
- JavaScript support
- Tailwind CSS for styling
- Prettier for code formatting
- Optimized fonts with `next/font`


## Project Structure

```
├── pages/          # Pages directory
├── public/         # Static files
├── styles/         # Global styles
├── components/     # React components
├── lib/           # Utility functions
└── api/           # API routes
```

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn-pages-router) - an interactive Next.js tutorial.

## Deployment

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/pages/building-your-application/deploying) for more details.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
