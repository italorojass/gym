# Usar una imagen oficial de Node.js como imagen base para la fase de construcción
FROM node:18 AS build

# Establecer el directorio de trabajo dentro del contenedor
WORKDIR /gym

# Copiar package.json y package-lock.json
COPY package*.json ./

# Instalar dependencias de Node.js
RUN npm install

# Copiar el resto del código
COPY . .

# Ejecutar el build de la aplicación Angular
RUN npm run build --prod --base-href="/"

# Usar una imagen de Nginx para servir la aplicación en la fase de producción
FROM nginx:alpine

# Copiar los archivos compilados desde la fase de build a Nginx
COPY --from=build /gym/dist/app-gym /usr/share/nginx/html

# Exponer el puerto 80 para servir la aplicación
EXPOSE 80

# Iniciar Nginx
CMD ["nginx", "-g", "daemon off;"]
