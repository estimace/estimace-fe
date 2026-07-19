# Build stages run on the native build platform (e.g. arm64 on Apple Silicon)
# so esbuild/Vite don't crash under QEMU emulation. The dist output is static
# and architecture-independent, so only the final nginx stage targets the
# requested --platform. This enables building deploying the app from Macs.
FROM --platform=$BUILDPLATFORM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /opt/app

COPY package.json ./
COPY yarn.lock ./
RUN yarn --frozen-lockfile

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /opt/app
COPY --from=deps /opt/app/node_modules ./node_modules
COPY . .

ARG API_URL
ENV API_URL=$API_URL

RUN yarn build

# Production image, copy all the files and run the app
FROM nginx:1.31-alpine
WORKDIR /opt/app

RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/
COPY --from=builder /opt/app/dist ./

EXPOSE 3010

CMD ["nginx", "-g", "daemon off;"]