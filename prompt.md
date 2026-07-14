I want to build a modern e-commerce platform using Medusa v2.

Requirements:
- Use Bun as the package manager.
- Use a Turborepo monorepo.
- Create a Medusa backend in apps/server.
- Create a Next.js storefront in apps/storefront.
- do not modify anything in  apps/web.
- Configure Docker Compose with PostgreSQL.
- Configure all required environment variables.
- Set up the storefront to communicate with the Medusa backend.
- Use the latest stable Medusa version.
- Follow Medusa best practices.
- Keep the project scalable so I can later add an Expo React Native app in apps/mobile.
- Use shared packages where appropriate.
- Explain each generated file and command.
- Do not skip any setup steps.

how the structure should be: 

ez-commerce/
├── apps/
│   ├── server/          # Medusa backend
│   ├── storefront/      # Next.js storefront
│   ├── web/              # another nextJs app.  I already have it, no need to change here. 
│
├── packages/
│   └── sdk/             # Shared Medusa SDK client
│
├── docker/
│   └── docker-compose.yml
│
├── package.json
├── turbo.json
└── bun.lock