# Fablab Api Gateway
Api Gateway für die Zugriffsteuerung des Fablabs über Odoo und openHAB

## Usage

### node.js installieren
* Installer (Windows, macOS) / Manuell (Linux)
https://nodejs.org/en/download/current/

* Node Version Manager (nvm)
https://nodejs.org/en/

Node Version >= 11.1.0

### Abhängigkeiten Installieren
```bash
$ npm install
```

### Konfiguration anpassen
* Unter ./config/ eine Kopie von "default.sample.json" anlegen und zu "default.json" umbennen
* Die jeweiligen Parameter anpassen

### Tests ausführen
```bash
$ npm run test
```
**Info:** Die Tests sind nach einem größeren Refactoring nicht funktional

### Starten der Entwicklungsumgebung Umgebung
```bash
$ npm run dev
```
**Info:** Startet einen development Server mit live reloading

### Starten der Produktivumgebung
Führt den letzten build im Ordner "dist" aus, falls vorhanden.
```bash
$ npm start
```

**Nach dem Clonen dieses Repos, für den intialen build** und für das erneute builden und starten:
```bash
$ npm run prod
```
## Benötigte Drittkomponenten
* openHAB [Docker](https://hub.docker.com/r/openhab/openhab/#running-from-compose-fileyml)
* odoo [Docker](https://hub.docker.com/_/odoo/)
  * Hat Postgres als abhängigkeit
* MongoDB [Docker](https://hub.docker.com/_/mongo)
  * Beinhaltet bei der Verwendung des vorgeschlagenen docker-compose files `mongo-express` (ähnliche wie phpMyAdmin für MySQL). **Welches im folgenden bei der Erstellung der nötigen Collections und Dokumente sehr hilfreich ist**

Hier empfiehlt sich der einfacheit halber die Verwendung von `docker-compose`. Die verlinkten Seiten aus dem Docker Hub bieten fertige Vorlagen für docker-compose files an. Im Falle von odoo bindet dies auch Postgres mit ein

## openHAB Konfiguration

### ZWave
* Addon installieren

### RestAPI
openHAB kommt mit einer REST API. der nachfolgende Schritt vereinfacht lediglich das Arbeiten mit dieser.
* Rest API Documentation installieren
  * Addons -> Misc -> REST Documentation 

### Things anlegen
* Things konfigurieren (z.B. zWave Steckdosen)
* Thing Channel (z.B. Switch) einem Item zuweisen.
Openhab Doku: [link](https://www.openhab.org/docs/configuration/paperui.html)

## odoo Konfiguration

### Zusätzliche Felder in den Kundenkontakten anlegen
1. Entwicklermodus im odoo Frontend öffnen
2. Im Kontext Menü unter Felder anzeigen, folgende Felder anlegen
   1. x_RFID_Card_UUID , Type: String
   2. x_hadSecurityBriefing , Type: Boolean
   
### View der Kontaktansicht anpassen
1. Reiter in der Kundenkarteikarte mit Fablab spezifischen Feldern anlegen
   1. Enwticklermodus öffnen
   2. Im Kontext Menü unter Edit View: Formular, im XML des Views das Elternelement `<notebook colspan="4">` um folgendes Pageelement erweitern:
```xml
<page name="fablab_settings" string="Fablab Einstellungen">
  <group name="container_row_3">
      <group string="Sicherheit">
          <field name="x_hadSecurityBriefing"/>
      </group>
      <group string="Zugangsmedium">
          <field name="x_RFID_Card_UUID"/>
      </group>
  </group>
</page>
``` 
### Artikel für Maschinen/Geräte-Stunden anlegen
* Artikel als Serviceleistung anlegen unter `Lager->Stammdaten->Produkte`
  * Die odoo Artikel ID lässt sich aus der URL in der Stammdatenansicht des Produktes entnehmen

## Datenmodell in MongoDB erstellen
* Datenbank in MongoDB erstellen
* Collections anlegen
  * Collections aus dem Order `mongo-sample-collections` importieren
* Die Collection `devices` enthält Devices
  * Diese sind mit den in openhab angelegeten `Items` abzugleichen. Die Referenz für das openhab Item, ist dessen Name. Dieser ist in der `devices` Collection im `actor` Object unter `indentifier` einzutragen. Weitere Devices einfach in Form neuer Dokumente anlegen
* `productID` in der Collection `productReferences` durch die Artikel ID des zuvor anglegten Artikels ersetzen.

## Konfiguration anpassen

* Datei `default.sample.json` zweimal duplizieren
  * Eine Version wird in `development.json` umbenannt. Diese Version beinhaltet die Konfiguration für die Entwicklungsumgebung
  * Die zweite Version wird in `production.json` umbenannt. Sie enthält die Konfiguration für die Produktivumgebung.
* Im Falle von `npm run dev` wird die Konfiguration `development.json`. Für `npm start` und `npm run prod` wird die Konfiguration `production.json` geladen.
* Konfigurationsdateien anpassen

## Architecture

### Systemarchitektur
Folgende Grafik zeigt die grobe Systemarchitektur:
![Architecture](./readme/architectureV2.png)

### Applikationsarchitektur
Folgende Grafik zeigt die Schichten und Komponenten der Software
![Architecture](./readme/softwareArchitecture.png)

### Datenmodell (MongoDB)
* place ----1:n---> device
* deviceBooking ---1:1---> device
* producReference ---1:n---> device

Grafik folgt

## API

### Authentification
```
POST /auth/app
```
Gibt bei erfolgreicher Authentifizierung einen Token für das Zugriffsgerät (Gerät) zurück

#### Header
| Key          |              Value                 | 
|--------------|:----------------------------------:|
| content-type | application/x-www-form-urlencoded  |

#### Body
`deviceID=[DeviceIdentifier]&apiKey=[APIKey]` 

Der API Key wird in der Config gesetzt. Device Identifier ist momentan noch hardcodiert auf "AccessDevice1". Die Authetifizierung der Zugriffsgeräte ist bestand architektureller Veränderungen. Der Plan ist hier, dass Geräte einem Place zugewiesen werden und jeweils einen eigenen API erhalten

#### Response
```JSON
{
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkZXZpY2VJRCI6IkFjY2Vzc0RldmljZTEiLCJpYXQiOjE1NTQ3MDI5NzN9.80jRaKvmxVsunwk5sg2fmj3290EQ5G2KxIdZPVmNtRY",
    "deviceID": "AccessDevice1"
}
```
----------------------

```
POST /auth/user
```
Erezeugt ein intermediate Token für das Buchen eines Gerätes (Gültigkeit 20 Sekunden), in der ein Gerät gebucht werden kann

#### Header
| Key          |              Value                 | 
|--------------|------------------------------------|
| content-type | application/x-www-form-urlencoded  |

#### Body
`userID=[UserUUID]&apiKey=[ApiKey]` 

[UserUUID] in odoo hinterlegte RFID_UUID, [APIKey] wie oben

#### Response
```JSON
{
    "user": {
        "id": 7,
        "name": "Fabian Meyer",
        "userID": "9D909C1E",
        "hasSecurityBriefing": true
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NywibmFtZSI6IkZhYmlhbiBNZXllciIsInhfaXNBZG1pbiI6dHJ1ZSwidXNlcklEIjoiOUQ5MDlDMUUiLCJoYXNTZWN1cml0eUJyaWVmaW5nIjp0cnVlLCJpYXQiOjE1NTQ3MDM4NzEsImV4cCI6MTU1NDcwMzg5MX0.pCofejKs9O5KzsP9g95EJshtkHJYbvrpqnl9IuykZZE"
}
```

----------------------

### Devices
```
GET /device/:id
```
Gibt ein einzelnes Device mit der ID `:id` zurück. Bei der `:id` handelt es sich um die ObjectID aus der MongoDB

#### Header
| Key           |              Value                 | 
|---------------|------------------------------------|
| Authorization | Bearer [Token]                     |

[Token] ist der unter `/auth/app` erworbene Tolen

#### Response
```JSON
{
    "devices": {
        "_id": "5c95e60985c19400095d7d6d",
        "deviceName": "3D Drucker 2",
        "productReferenceID": "5c9c623a85c19400095d7d79",
        "isOutOfOrder": false,
        "actor": {
            "identifier": "3_Drucker_2",
            "platformIdentifier": "openhab"
        }
    }
}
```

----------------------

```
GET /devices/?id=[deviceID1]&id=[deviceID2]
```
Gibt alle in der query variable `id` angefragten Devices als Array zurück. Bei dem Wert von `id` handelt es sich um die ObjectID aus der MongoDB

### Header
| Key           |              Value                 | 
|---------------|------------------------------------|
| Authorization | Bearer [Token]                     |

[Token] ist der unter `/auth/app` erworbene Tolen

### Response
```JSON
[
    {
        "_id": "5c95e60985c19400095d7d6d",
        "deviceName": "3D Drucker 2",
        "productReferenceID": "5c9c623a85c19400095d7d79",
        "isOutOfOrder": false,
        "actor": {
            "identifier": "3D_Drucker_2",
            "platformIdentifier": "openhab"
        }
    },
    {
        "_id": "5c95e67e85c19400095d7d73",
        "deviceName": "3D Drucker 4",
        "productReferenceID": "5c9c623a85c19400095d7d79",
        "isOutOfOrder": false,
        "actor": {
            "identifier": "3D_Drucker_4",
            "platformIdentifier": "openhab"
        }
    }
]
```

----------------------

### Place
```
GET /place/:id
```
Gibt den Place mit der ID `:id` zurück. Bei der `:id` handelt es sich um die ObjectID aus der MongoDB. Ein Place beinhaltet einen Array von Positions. Jede Position besteht aus einem Device und seinen Koordinaten.

#### Header
| Key           |              Value                 | 
|---------------|------------------------------------|
| Authorization | Bearer [Token]                     |

[Token] ist der unter `/auth/app` erworbene Tolen

#### Respone
```JSON
{
    "_id": "5c9c63fe85c19400095d7d7b",
    "placeName": "Regal 1",
    "placeLabel": "Regal 1",
    "placeType": "shelf",
    "positions": [
        {
            "deviceID": "5c95e60985c19400095d7d6d",
            "coordinates": [
                0,
                1
            ]
        },
        {
            "deviceID": "5c95e67e85c19400095d7d73",
            "coordinates": [
                1,
                1
            ]
        },
        {
            "deviceID": "5c95e69c85c19400095d7d75",
            "coordinates": [
                2,
                0
            ]
        },
        {
            "deviceID": "5c95e6a785c19400095d7d77",
            "coordinates": [
                0,
                0
            ]
        }
    ]
}
```
----------------------

### Bookings
```
GET /booking/:id
```
Gibt die Buchung mit der ID `:id` zurück. Bei der `:id` handelt es sich um die ObjectID aus der MongoDB.

#### Header
| Key           |              Value                 | 
|---------------|------------------------------------|
| Authorization | Bearer [Token]                     |

[Token] ist der unter `/auth/app` erworbene Tolen

#### Response
```JSON
{
    "_id": "5ca0b960544bb57d50f6aa3f",
    "deviceID": "5c95e67e85c19400095d7d73",
    "userUID": "9D909C1E",
    "startTime": 1554037088
}
```
----------------------

```
GET /bookings/?deviceID=[deviceID1]&deviceID=[deviceID2]
```
Gibt alle Buchungen der in der query variable `deviceID` angefragten Devices als Array zurück. Bei dem Wert von `deviceID` handelt es sich um die ObjectID aus der MongoDB des jeweiligen Devices.

#### Header
| Key           |              Value                 | 
|---------------|------------------------------------|
| Authorization | Bearer [Token]                     |

[Token] ist der unter `/auth/app` erworbene Tolen

#### Response
```JSON
[
    {
        "_id": "5ca0b779544bb57d50f6aa3d",
        "deviceID": "5c95e60985c19400095d7d6d",
        "userUID": "9D909C1E",
        "startTime": 1554036601
    },
    {
        "_id": "5ca0b960544bb57d50f6aa3f",
        "deviceID": "5c95e67e85c19400095d7d73",
        "userUID": "9D909C1E",
        "startTime": 1554037088
    }
]
```
`startime` ist ein Unix Timestamp

----------------------

```
POST /booking
```
Erzeugt eine Buchung in der Datenbank (MongoDB) und gibt ein JSON Objekt der id der angelegten Buchung zurück

#### Header
| Key           |              Value                 | 
|---------------|------------------------------------|
| Authorization | Bearer [Token]                     |
| Accept        | application/json                   |
| Content-Type  | application/json                   |

[Token] ist der unter `/auth/app` erworbene Tolen

#### Body
```JSON
{
      deviceID: deviceID,
      userUID: userID,
      intermediateToken: intermediateToken
}
```
`deviceID` ist die ObjectID (_id) des Devices aus MongoDB. `userUID` die in odoo hinterlegte RFID UUID. `intermediateToken` ist der über die Route `/auth/user` bezogene Token.


#### Response
```JSON
{
    "status": "OK",
    "bookingID": "5cab7dad3bc0285e7a838865"
}
```

----------------------


```
DELETE /booking/:id
```
Beendet eine Buchung mit der ID `:id` und erzeugt eine Rechnung in odoo

#### Header
| Key           |              Value                 | 
|---------------|------------------------------------|
| Authorization | Bearer [Token]                     |
| Accept        | application/json                   |
| Content-Type  | application/json                   |

[Token] ist der unter `/auth/app` erworbene Tolen

#### Body
```JSON
{
      intermediateToken: [intermediateToken]
}
```
`intermediateToken` ist der über die Route `/auth/user` bezogene Token.


#### Response
```JSON
{
    "status": "OK"
}
```

## TODO
- [ ] POST, DELETE und PUT Routen für alle MongoDB Entitäten
- [ ] Schemavaliierung der Requests
- [ ] Fehlende Fehlermeldungen Ergänzen
- [ ] Unit-/Integrationtests
- [ ] Verwaltungsoberfläche (z.B. zum Anlegen von Devices, Produktreferenzen, Places usw.)
- [ ] Debug Logs hinzufügen
- [ ] Odoo hinter Interface verstecken (Zu Abstraktion im Service Layer)
- [ ] Stromverbrauch aus openhab abfragen und mit in der Rechnung vermerken
- [ ] Docker Image für das API-Gateway bauen
- [ ] Init Script erstellen (Zur Vereinfachung des initalen Setups)
- [ ] Websocket für Realtimekokmmunikation implementieren (Push Benachtichtigungen für die App/Zugriffsgerät)
- [ ] Erstellte Rechnung in Odoo bestätigen
- [ ] App/Zugriffsgerät als Entität in MongoDB anlegen und separate API Keys hinterlegen. App Authentifitierung anpassen
- [ ] Beendigung eines Nutzungsvorgangs erkennen (z.B. Ende des 3D Drucks durch geringeren Strom verbauch)
- [ ] To be continued

## LICENSE
Unter Vorbehalt*: [MIT License](https://opensource.org/licenses/MIT)

*Bis Absichtserkärung aufgesetzt