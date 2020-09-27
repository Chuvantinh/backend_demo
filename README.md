# buddy-app-backend

Voraussetzungen:
1. Node + npm (version bitte der datei package.json entnehmen)
2. Docker + docker-compose

## Erstellen eines lokalen Backends
Alle Befehle im **app** verzeichnis des repositories ausführen.

### Projekt Dependencies installieren

`npm install`

### Global Dependencies installieren:
Prisma

`npm install -g prisma`

Weitere Globale abhängigkeiten:

`npm i -g tsc-watch`

`npm install -g nodemon`

`npm install -g graphql-cli`

`npm install -g graphqlgen`


### .env File
`.env` File zu konfiguration der umgebungsvariablen anlegen im ordner `app`

Inhalt:
```json
PRISMA_ENDPOINT="http://localhost:4477"
PRISMA_MANAGEMENT_API_SECRET="my-server-secret-123"
SERVER_PORT="4011"

APP_PRIVATE_KEY="private-key"

GRAPHQL_PLAYGROUND_TOKEN_LOCAL=""
GRAPHQL_PLAYGROUND_TOKEN_TMCC=""

VAPID_PUBLIC_KEY="vapid-public"
VAPID_PRIVATE_KEY="vapid-private"

TOKEN_EXPIRY_TIME="1d"

DEBUG=true
ALLOW_INTROSPECTION=true
PLAYGROUND=true

TASK_TICK_INTERVAL_MS=1000

CORS_ORIGIN="*"
```
siehe hierzu auch die `.env.docker` datei als beispiel

### Dev mode mit Change Detection Starten
`npm run node-dev` - watch mode mit nodemon

-- oder --

`npm run dev` - tsc-watch mode


App API nach dem Start erreichbar unter : `http://localhost:4011/`

> Weitere optionen:
> ### Builden
> `npm run build`
> ### Server starten
> `npm start`
> ### Server builden und starten
> `npm run serve`


### Docker Container für lokale Entwicklungsumgebung
1. Docker CE installieren
2. `docker-compose up -d`
3. prüfen ob prisma und datenbank container laufen: `docker ps`

* Erwartete ausgabe Container:
```
buddybackend_prisma_1 Port: 4477
buddybackend_mysql-db_1 Port: 3306
```

* Die Prisma API ist wenn die Docker Container laufen erreichbar unter: `http://localhost:4477`

### Deploy Prisma
bei erstmaligen ausführen und bei jedem update der API nötig:
* `prisma deploy --env-file .env.docker`
* API update erfolgt immer wenn es änderungen in der Datei `\database\datamodel.graphql` gab.

#### GrapqhQL Playground
Herunterladen & installieren
* https://github.com/prisma-labs/graphql-playground/releases
* Sollte automatisch die Projektdaten aus der Datei `.graphqlconfig` übernehmen


##### Prisma API
ermöglicht direkte manipulation der Datenbank über die Prisma API

* Die Prisma API unter `db-local` im docker container ist unter `http://localhost:4477` erreichbar
* mit `prisma token --env-file .env.docker` einen gültigen token erzeugen
* im Playground den token als http header eintragen
```json
{
  "Authorization": "Bearer your-token-here"
}
```
* nun sollte die Prisma api erreichbar sein


#### Admin interface
* erreichbar unter `http://localhost:4477/_admin`
* mit token direkt aufrufen: `prisma admin --env-file .env.docker`


#### Dev Server Api
ermöglicht GraphQL requests wie sie auch dem Frontend zur verfügung stehen

* Die Server API ist unter http://localhost:4011/ erreichbar wenn der dev Server läuft!

Prisma API neu deployen
  * jedem update der Prisma API muss neu deployed werde
  * am besten nach jedem aktualisieren des repositories ausführen
  * `prisma deploy --env-file .env.docker`

## Initialisieren der Dev umgebung
Besteht aus 4 schritten

1. Globale Config in die DB Schreiben
2. Nutzer 'Admin' anlegen
3. Aktivitäten in DB Schreiben
4. Nutzer 'Patienten' anlegen (mindestens 2)

### Anlegen der Global Konfiguration 
Muss einmalig nach aufsetzten der Datenbank im Playground erfolgen!

* eine der `createGlobalSettings` Mutations in der gegen `db-local` ìm Playground ausführen.
* Siehe Datei `app/src/global_settings/global.settings.seed.graphql` für Vorlage


### Anlegen von Nutzern
Nach dem erstmaligen aufsetzten der Docker container müssen Nutzer angelegt werden.

##### Admin
1.  Admin anlegen
  > Diese Mutation nuss direkt gegen die **Prisma API** ausgeführt werden (`db-local` - im Dev Modus Port 4466)
```graphql
mutation seedAdmin {
  createUser(
    data: {
      username:"Admin"
      password: "sehr langes sicheres passwort" #passwort ersetzten
      role: ADMIN,
      settings: {
        create:{
          themeName:"theme-06-teal-amber"
        }
      }
    }
  ){
    id
    createdAt
  }
}
```

1. Admin Registrieren
> diese Mutation gegen die **Server API** ausführen! (`local` - im Dev Modus Port 4011)
```graphql
mutation registerAdmin {
	registerUser(
    username: "Admin", 
    password:"sehr langes sicheres passwort" #passwort ersetzten
    verificationCode:"BuddyUser")
}
```

1.  Admin einloggen
> diese Mutation gegen die **Server API** ausführen! (`local` - im Dev Modus Port 4011)
```graphql
mutation loginAdmin {
  login(
    username:"Admin", 
    password:"sehr langes sicheres passwort"
  ){
    user {
      username
    }
    token
  }
}
```

##### Patienten
Um Patienten anzulegen als Admin einloggen (siehe oben) !

Als HTTP Header muss ein Authorization Token eingetragen werden. Token wird als rückgabewert der `login` mutation geliefert.
```json
{
  "Authorization": "Bearer INSERT_TOKEN_HERE"
}
```


1. Nutzer mit  beliebigem Name und Verifikationcode anglegen
```graphql
mutation seedAlice {
  createAppUser(
    username: "A_USER_NAME"
    verificationCode: "BuddyUser"  
    role: PATIENT
  ) {
    id
    createdAt
  }
}
```
2. Den Nutzer mit einem Passwort registrieren - hierbei wird der Verifikationcode und Nutzername aus Schritt 1. überprüft

```graphql
mutation registerUser {
	registerUser(
    username: "A_USER_NAME", 
    password:"123456", 
    verificationCode:"BuddyUser" #muss mit verfication code aus createAppUser übereinstimmen
  )
}
```

3. (optional) um im Playground queries und mutation als Patient auszuführen ein token generiert werden.
Hierzu dient die `login` mutation:
  
```graphql
mutation login {
  login(
    username:"A_USER_NAME", 
    password: "123456"){
    token
    user {
      id
      username
    }
  }
}
```
Den erzeugten Token aus der rückgabe der mutation im Playground als http header eintragen

```json
{
  "Authorization": "Bearer INSERT_TOKE_HERE"
}
```

#### Category und Group, GroupColors zu erschaffen
Laufen diese folgende Command, um die Daten für Category , Group , Groups Color zu erstellen
Sie können mehrer Category, und Group, GroupColor schaffen,wie Sie wünschen.
```graphql
  mutation {
    createGroup(data:{
      title: "Für Studenten",
      description: "Beschreibung von Studenten",
      createdBy:{
        connect:{
          id: "ckcys3hcg001v0719yxusdh52"
        }
      }
    }){
     id,
      title
    }
  }
  
    createGroupColor(
        data:{
          color: "yellow",
          group:{
            connect:{
              id: "ckd1gw3xy008v0731p4x1o067"
            }
          }
        }
    ){
        id,
        color
    }
      createCategory(
        data:{
            title: "Geschäftmodel"
            description: "Beschreibung für diese Category"
        }
      ){
        id
      }
```

### Aktivitäten erstellen
Muss einmalig nach aufsetzten der Datenbank geschehen!

1. Als Admin im Frontend einloggen
2. Menüpunkt 'Aktivitäten'
3. Profile Sport -> Key Gen -> Send to DB
4. Activities -> Generate -> Send to DB

### Lokale Prisma Installation ausführen
Nur relevant wenn prisma **nicht** global installiert ist

Via npm script

`npm run prisma -- deploy --env-file .\.env.docker `

direkt

`.\node_modules\.bin\prisma deploy --env-file .\.env.docker`



## DEPRECATED Heroku  Server
Der Server wurde [hier](https://buddy-app-backend.herokuapp.com/ "Hier geht es zum Buddy-Backend") deployed.