FROM ghcr.io/puppeteer/puppeteer:latest

# Diretório de trabalho dentro do container
WORKDIR /app

# Copia package.json e package-lock.json
COPY package*.json ./

# Instala as dependências
RUN npm install

# Copia o restante do código para dentro da imagem
COPY . .

# Expõe a porta do servidor Express
EXPOSE 3000

# Comando para iniciar o servidor
CMD ["npm", "start"]
