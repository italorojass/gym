# Usa Node.js como base
FROM node:18

# Establecer el directorio de trabajo dentro del contenedor
WORKDIR /gym

# Copiar package.json y package-lock.json
COPY package*.json ./

# Instalar dependencias, incluida Angular CLI
RUN npm install

# Copiar el resto del código al contenedor
COPY . .

# Construir la aplicación Angular
RUN npm run build --prod

# Usar un servidor estático como nginx para servir la aplicación
FROM nginx:alpine
COPY --from=build /gym/dist/app-gym /usr/share/nginx/html

# Exponer el puerto
EXPOSE 80
