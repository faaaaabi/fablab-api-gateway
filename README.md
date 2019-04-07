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
1. Sind Geräte örtlich zusammengefasst (z.B.) in einem Regal:
   * Item vom Typ Group anlegen
     * Diesem die Category "Positional" geben
   * Item (Geräte) dieser mit dem obigen Item als Parent versehen

2. Positionierung bei örtlich zusammengefassten Geräten
   * Entweder manuell oder mit Swagger (http://\<HostWoOpenHabLaeuft\>:\<port\>/doc/index.html) dem Item die Postion als Metadata zufügen
   * Über die Route PUT /items/{itemname}/metadata/{namespace}
     * {itemname} : selbsterklärend
     * {namespace}: position
     * body: {"config": {"x": 0, y: 0} }
       * Wer für x und y durch adäquate Position ersetzen

## odoo konfiguration

### Zusätliche Felder in den Kundenkontakten anlegen
1. Entwicklermodus öffnen im odoo Frontend öffnen
2. Im Kontext Menü unter Felder anzeigen, folgende Felder anlegen
   1. x_RFID_Card_UUID , Type: String
   2. x_hadSecurityBriefing , Type: Boolean
   3. x_isAdmim , Type: Boolean
   
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
      <group string="Sicherheit">
          <field name="x_isAdmin"/>
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
![Architecture](./readme/softwareArchitecture.png)
