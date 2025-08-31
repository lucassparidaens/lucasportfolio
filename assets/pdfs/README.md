# 📄 PDF Assets Folder

Deze folder bevat alle PDF bestanden voor de portfolio projecten.

## 📁 Huidige PDFs:
- `getdjoice-homepage.pdf` → Screenshot van Getdjoice.com homepage (1.1MB)

## 🔧 Hoe PDFs toevoegen:

### Voor Nieuwe Projecten:
1. **Via System 7 Interface:** Upload PDF via "Add Project" formulier
2. **Direct in Code:** Voeg PDF toe aan `getProjectsData()` in `assets/js/system7.js`

### Voor Bestaande Projecten:
1. **PDF maken:** Screenshot → Print to PDF of Web2PDF tool
2. **Bestand plaatsen:** Kopieer naar `assets/pdfs/`
3. **Code updaten:** Voeg PDF object toe aan project:
   ```javascript
   {
       id: 'project-name',
       name: 'Project Name',
       // ... andere velden ...
       pdf: {
           name: 'project-homepage.pdf',
           url: 'assets/pdfs/project-homepage.pdf',
           size: 1234567  // bestandsgrootte in bytes
       }
   }
   ```

## 📊 Bestandsgrootte checken:
```bash
ls -la assets/pdfs/
```

## 🎯 Aanbevolen naming:
- `gamestoelen-homepage.pdf`
- `pettech-productpage.pdf` 
- `freakygoodz-checkout.pdf`
- `margriet-article.pdf`
- `dakkie-app-screens.pdf`

## 🔧 Supported Features:
- ✅ PDF Viewer in System 7 window
- ✅ Direct download functionaliteit  
- ✅ File size display
- ✅ Both file URLs en base64 data support
- ✅ Automatic integration met project detail windows
