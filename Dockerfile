# Usa una imagen base de Node.js
FROM node:14

# Establecer el directorio de trabajo en la imagen de Docker
WORKDIR /dist/app-gym

# Copiar los archivos de la aplicación
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el resto de los archivos
COPY . .

# Construir la aplicación para producción
RUN npm run build

# Usar Nginx para servir la aplicación Angular
FROM nginx:alpine
COPY --from=build /app/dist/app-gym /usr/share/nginx/html

# Exponer el puerto
EXPOSE 80
