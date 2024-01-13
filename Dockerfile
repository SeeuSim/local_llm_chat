# syntax=docker/dockerfile:1.4

# Adapted from https://github.com/vercel/next.js/blob/e60a1e747c3f521fc24dfd9ee2989e13afeb0a9b/examples/with-docker/Dockerfile
# For more information, see https://nextjs.org/docs/pages/building-your-application/deploying#docker-image

FROM node:lts AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY --link package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
RUN \
  if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci; \
  elif [ -f pnpm-lock.yaml ]; then yarn global add pnpm && pnpm i --frozen-lockfile; \
  else echo "Lockfile not found." && exit 1; \
  fi


# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps --link /app/node_modules ./node_modules
COPY --link  . .

# We only use .env.prod
RUN rm .env.dev

RUN npm run build:prod

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN \
  addgroup --system --gid 1001 nodejs; \
  adduser --system --uid 10001 nextjs \
  && chown -R nextjs:nodejs /app

COPY --from=builder --link /app/public ./public
COPY --from=builder /app/next.config.js ./

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --link --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --link --chown=nextjs:nodejs /app/.next/static ./.next/static

# # Setup the Sharp image cache
RUN mkdir -p /app/.next/cache/images && chown nextjs:nodejs /app/.next/cache/images
VOLUME /app/.next/cache/images


RUN rm -rf \
  /usr/share/man/* \
  /usr/includes/* \
  /var/cache/apk/* \
  /root/.npm/* \
  /usr/lib/node_modules/npm/man/* \
  /usr/lib/node_modules/npm/doc/* \
  /usr/lib/node_modules/npm/html/* \
  /usr/lib/node_modules/npm/scripts/*

# RUN deluser --remove-home daemon \
#   && deluser --remove-home adm \
#   && deluser --remove-home lp \
#   && deluser --remove-home sync \
#   && deluser --remove-home shutdown \
#   && deluser --remove-home halt \
#   && deluser --remove-home postmaster \
#   && deluser --remove-home cyrus \
#   && deluser --remove-home mail \
#   && deluser --remove-home news \
#   && deluser --remove-home uucp \
#   && deluser --remove-home operator \
#   && deluser --remove-home man \
#   && deluser --remove-home cron \
#   && deluser --remove-home ftp \
#   && deluser --remove-home sshd \
#   && deluser --remove-home at \
#   && deluser --remove-home squid \
#   && deluser --remove-home xfs \
#   && deluser --remove-home games \
#   && deluser --remove-home vpopmail \
#   && deluser --remove-home ntp \
#   && deluser --remove-home smmsp \
#   && deluser --remove-home guest

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME 0.0.0.0

# Allow the running process to write model files to the cache folder.
# NOTE: In practice, you would probably want to pre-download the model files to avoid having to download them on-the-fly.
RUN mkdir -p /app/node_modules/@xenova/.cache/
RUN chmod 777 -R /app/node_modules/@xenova/

CMD ["node", "server.js"]