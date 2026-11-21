
# FROM node:24-slim AS frontend
# WORKDIR /app/frontend
# COPY frontend/package.json .
# COPY frontend/package-lock.json .
# RUN npm ci
# COPY frontend/ .
# ENV VITE_SERVER_URL=/api 
# RUN npm run build


FROM node:24-slim AS backend
WORKDIR /app
COPY package.json .
COPY package-lock.json .
RUN npm ci
COPY . .
RUN npx prisma generate
RUN npm run build 



FROM node:24-slim
WORKDIR /app
COPY package.json .
COPY package-lock.json .
RUN npm ci 

COPY --from=backend /app/dist ./dist
# COPY --from=frontend /app/frontend/dist ./frontend/dist

COPY prisma/ ./prisma
COPY prisma7.config.ts .


# uv installs Python and the parser's dependencies
COPY --from=ghcr.io/astral-sh/uv:0.13.8 /uv /uvx /bin/
WORKDIR /app/parser
COPY parser/pyproject.toml .
COPY parser/uv.lock .
COPY parser/.python-version .
RUN uv sync --locked 
COPY parser/ .

WORKDIR /app
COPY start.sh ./
ENV NODE_ENV=production
EXPOSE 3000
CMD ["sh", "/app/start.sh"] 
