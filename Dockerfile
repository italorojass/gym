# Usar la versión 18 de Node.js
FROM node:18

# Establecer el directorio de trabajo
WORKDIR /

# Copiar los archivos de package.json e instalar las dependencias
COPY package*.json ./
RUN npm install

# Copiar el resto de los archivos
COPY . .

# Construir la aplicación (puedes ajustar el comando según tu proyecto)
RUN npm run build

# Exponer el puerto (si es necesario)
EXPOSE 80

# Comando para iniciar la aplicación
CMD ["npm", "start"]
