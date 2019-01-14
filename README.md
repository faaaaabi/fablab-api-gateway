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