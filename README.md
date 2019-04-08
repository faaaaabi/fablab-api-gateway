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

### Starten der Entwicklungsumgebung Umgebung
```bash
$ npm run dev
```

### Starten der Produktivumgebung
Führt den letzten build im Ordner "dist" aus, falls vorhanden.
```bash
$ npm start
```

**Nach dem Clonen dieses Repos, für den intialen build** und für das erneute builden und starten:
```bash
$ npm run prod
```

## openHAB konfiguration

### ZWave
* Addon installieren

### RestAPI
openHAB kommt mit einer REST API. der nachfolgende Schritt vereinfacht ledeiglich das Arbeiten mit dieser.
* Rest API Documentation installieren
  * Addons -> Misc -> REST Documentation 

### Geräte anlegen
* Things konfigurieren (z.B. zWave Steckdosen)
* Thing Channel (z.B. Switch) einem Item zuweisen
Openhab Doku: [link](https://www.openhab.org/docs/configuration/paperui.html)

## odoo konfiguration

### Zusätliche Felder in den Kundenkontakten anlegen
1. Entwicklermodus öffnen im odoo Frontend öffnen
2. Im Kontext Menü unter Felder anzeigen, folgende Felder anlegen
   1. x_RFID_Card_UUID , Type: String
   2. x_hadSecurityBriefing , Type: Boolean
   
### View der Kontaktansicht anpassen
1. Reiter in der Kundenkarteikarte mit Fablab spezifischen Feldern anzeigen
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

## Architecture

### Systemarchitektur
Folgende Grafik zeigt die grobe Systemarchitektur:

![Architecture](./readme/architectureV2.png)

### Applikationsarchitektur
Folgende Grafik zeigt die Schichten und Komponenten der Software
![Architecture](./readme/softwareArchitecture.png)

## API

```
POST /auth/app
```
Gibt bei erfolgreicher Authentifizierung einen Token für das Zugriffsgerät (Gerät) zurück

### Header
| Key          |              Value                 | 
|--------------|:----------------------------------:|
| content-type | application/x-www-form-urlencoded  |

### Body
`deviceID=[DeviceIdentifier]&apiKey=[APIKey]` 

Der API wird in der Config gesetzt. Device Identifier ist momentan noch hardcodiert auf "AccessDevice1". Die Authetifizierung der Zugriffsgeräte ist bestand archtektureller Veränderungen. Der Plan ist hier, dass Geräte einem Place zugewiesen werden und jeweils einen eigenen API erhalten

### Response
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

### Header
| Key          |              Value                 | 
|--------------|------------------------------------|
| content-type | application/x-www-form-urlencoded  |

### Body
`userID=[UserUUID]&apiKey=[ApiKey]` 

[UserUUID] in odoo hinterlegte RFID_UUID, [APIKey] wie oben

### Response
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

```
GET /device/:id
```
Gibt ein einzelnes Device mit der ID `:id` zurück. Bei der `:id` handelt es sich um die ObjectID aus der MongoDB

### Header
| Key           |              Value                 | 
|---------------|------------------------------------|
| Authorization | Bearer [Token]                     |

[Token] ist der unter `/auth/app` erworbene Tolen

### Response
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

-----------------

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

---------

```
GET /place/:id
```
Gibt den Place mit der ID `:id` zurück. Bei der `:id` handelt es sich um die ObjectID aus der MongoDB. Ein Place beinhaltet einen Array von Positions. Jede Position hat besteht aus einem Device und seinen koordinaten.

### Header
| Key           |              Value                 | 
|---------------|------------------------------------|
| Authorization | Bearer [Token]                     |

[Token] ist der unter `/auth/app` erworbene Tolen

### Respone
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


