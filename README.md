# EdID

## How to use

1) Clone das Repository auf Lokal und geh in dem Projekt Root:

<!-- #default-branch-switch -->

2) Install die packages:

```sh
npm install
```

Wichtig: Node version muss mind. 18.2.0 sein

## Develop

You always can start the web application in three different ways:

- ```npm run dev``` dev mode with hot refresh und mocked database. For this config is also necessary to configure and
  start a local database.
- ```npm run dev:staging``` dev mode with access to staging APIs. This is the best option for local development.
- ```npm run start:production``` production mode using the web packed artifacts (ensure the app was built
  with ```npm run build``` before)
