##### DEPENDENCIES

FROM node:lts-bullseye-slim AS deps
WORKDIR /app

# Install Prisma Client - remove if not using Prisma

COPY prisma ./

# Install dependencies based on the preferred package manager

COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml\* ./

RUN \
 if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
 elif [ -f package-lock.json ]; then npm ci; \
 elif [ -f pnpm-lock.yaml ]; then yarn global add pnpm && pnpm i; \
 else echo "Lockfile not found." && exit 1; \
 fi

##### BUILDER
FROM node:lts-bullseye-slim AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED 1
ENV NEXT_PUBLIC_SUPABASE_URL "https://ljznmybxxehlzkomrunq.supabase.co"
ENV NEXT_PUBLIC_SUPABASE_ANON_KEY "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxqem5teWJ4eGVobHprb21ydW5xIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NzYyNTQ3NDYsImV4cCI6MTk5MTgzMDc0Nn0.qdjrmhYvorJ4OLy6p8svUv7c8jLvv8-vpcSQ8J-V0nc"
ENV NEXT_PUBLIC_MAPBOX_TOKEN "pk.eyJ1IjoibWF0dGJvd2VuIiwiYSI6ImNsZWh2bWZzMzAyaWgzeW50dmZuenJ6bHEifQ.5RG5cm9HFkpJh1Vc81rQtg"

RUN \
 if [ -f yarn.lock ]; then SKIP_ENV_VALIDATION=1 yarn build; \
 elif [ -f package-lock.json ]; then SKIP_ENV_VALIDATION=1 npm run build; \
 elif [ -f pnpm-lock.yaml ]; then yarn global add pnpm && SKIP_ENV_VALIDATION=1 pnpm run build; \
 else echo "Lockfile not found." && exit 1; \
 fi

##### RUNNER

FROM node:lts-bullseye-slim AS runner
WORKDIR /app

ENV NODE_ENV production

COPY --from=builder /app/next.config.mjs ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json

COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 8080
ENV PORT 8080
ENV HOSTNAME 0.0.0.0

CMD ["node", "server.js"]
