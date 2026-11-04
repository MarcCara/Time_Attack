# Time Attack

Joc de precisió temporal d'un jugador fet amb Vue 3 i Vite. Prem A, S, D i F quan creguis que han passat, respectivament, 2, 4, 5 i 7 segons. En acabar la partida, podràs consultar els temps i els errors a la taula de resultats.

## Requisits

- [Git](https://git-scm.com/)
- [Node.js](https://nodejs.org/) 22.18 o superior dins de la sèrie 22, o 24.12 o superior
- npm, inclòs amb Node.js

Pots comprovar les versions instal·lades amb:

```sh
node --version
npm --version
```

## Descarregar i iniciar el projecte

1. A GitHub, obre el repositori del projecte i copia'n l'adreça de clonació.
2. Des d'un terminal, clona'l i entra a la carpeta:

   ```sh
   git clone https://github.com/USUARIO/REPOSITORIO.git
   cd REPOSITORIO
   ```

   Substitueix l'adreça i `REPOSITORIO` pels valors reals del repositori.

3. Instal·la les dependències del projecte:

   ```sh
   npm ci
   ```

4. Inicia el servidor de desenvolupament:

   ```sh
   npm run dev
   ```

5. Obre al navegador l'adreça local que mostri el terminal (normalment `http://localhost:5173/`).

Per aturar el servidor, prem `Ctrl+C` al terminal.

## Altres ordres

Genera una versió optimitzada per publicar:

```sh
npm run build
```

Previsualitza localment la versió generada:

```sh
npm run preview
```

## Tecnologies

- Vue 3
- Vue Router
- Vite
