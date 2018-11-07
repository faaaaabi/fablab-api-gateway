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

### Starten der EntwicklungsumgebungUmgebung
```bash
$ npm run dev
```

### Starten der Produktivumgebung
```bash
$ npm start
```