FROM node:18.19-alpine3.18 as base
RUN apk update
RUN apk --no-cache upgrade
RUN apk add --no-cache libc6-compat

FROM base as depsbuild
RUN yarn global add pnpm

FROM depsbuild as deps
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm i --frozen-lockfile

FROM depsbuild as builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN pnpm build
# ARG ENV
# RUN pnpm build:$ENV
RUN pnpm next telemetry disable

FROM base as runner
WORKDIR /app

ARG ENV
ENV NODE_ENV=$ENV

# Set user perms
RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 10001 nextjs \
  && chown -R nextjs:nodejs /app

# Setup the Sharp image cache
RUN mkdir -p /app/.next/cache/images && chown nextjs:nodejs /app/.next/cache/images
VOLUME /app/.next/cache/images

COPY --from=builder /app/next.config.js ./

COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

RUN rm -rf \
  /usr/share/man/* \
  /usr/includes/* \
  /var/cache/apk/* \
  /root/.npm/* \
  /usr/lib/node_modules/npm/man/* \
  /usr/lib/node_modules/npm/doc/* \
  /usr/lib/node_modules/npm/html/* \
  /usr/lib/node_modules/npm/scripts/*

RUN deluser --remove-home daemon \
  && deluser --remove-home adm \
  && deluser --remove-home lp \
  && deluser --remove-home sync \
  && deluser --remove-home shutdown \
  && deluser --remove-home halt \
  && deluser --remove-home postmaster \
  && deluser --remove-home cyrus \
  && deluser --remove-home mail \
  && deluser --remove-home news \
  && deluser --remove-home uucp \
  && deluser --remove-home operator \
  && deluser --remove-home man \
  && deluser --remove-home cron \
  && deluser --remove-home ftp \
  && deluser --remove-home sshd \
  && deluser --remove-home at \
  && deluser --remove-home squid \
  && deluser --remove-home xfs \
  && deluser --remove-home games \
  && deluser --remove-home vpopmail \
  && deluser --remove-home ntp \
  && deluser --remove-home smmsp \
  && deluser --remove-home guest

USER nextjs
EXPOSE 3000
CMD ["node", "server.js"]
