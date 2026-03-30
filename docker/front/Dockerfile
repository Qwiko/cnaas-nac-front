# Build Stage
FROM node:24.14.0-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

# Update js files to reference window instead of process.env
RUN find /app -type f \( -name "*.ts" -o -name "*.tsx" \) -exec \
    sed -i "s|import\.meta\.env\.VITE_|window\.|g" '{}' +

RUN npm run build

# Production Stage
FROM nginx:stable-alpine AS production
COPY --from=build /app/dist /usr/share/nginx/html

COPY docker/front/env.sh /docker-entrypoint.d/env.sh
RUN chmod +x /docker-entrypoint.d/env.sh

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]


