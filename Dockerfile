FROM node:18-alpine AS base

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
FROM nginx:1.25-alpine
WORKDIR /opt/app

RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/
COPY --from=builder /opt/app/dist ./

EXPOSE 3010

CMD ["nginx", "-g", "daemon off;"]