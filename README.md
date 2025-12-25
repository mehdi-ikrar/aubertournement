# Tournoi E‑Sport Aubervilliers — Landing de préinscription (statique)

Mini-projet **HTML/CSS/JS** prêt à déployer sur **Netlify** (ou Vercel / GitHub Pages).  
Formulaire sans backend via **Formspree** (endpoint à remplacer).

## Arborescence
- `index.html`
- `css/style.css`
- `js/script.js`
- `assets/logo-placeholder.png`
- `assets/qr-placeholder.png`
- `netlify.toml` (optionnel)

## Avant de déployer (2 minutes)
### 1) Remplacer l’endpoint Formspree
Dans `index.html`, remplace :
```html
action="https://formspree.io/f/TON_ENDPOINT"
```
par ton endpoint réel, ex:
```html
action="https://formspree.io/f/abcdwxyz"
```

**Où le trouver ?**
1. Crée un formulaire sur https://formspree.io/
2. Copie l’endpoint fourni (`/f/...`)
3. Colle-le dans `index.html`

> Alternative : Basin (même principe) si tu préfères.

### 2) Remplacer date & lieu
Dans le Hero (`index.html`) remplace :
- `[PLACEHOLDER DATE]`
- `[LIEU—EX: Gymnase / Salle]`

### 3) Remplacer Instagram
Dans le footer (`index.html`), remplace `TON_INSTAGRAM`.

---

## QR code (placeholder → final)
Le bloc QR affiche `assets/qr-placeholder.png`.

### Option A (rapide) : Google Chart API
1. Déploie d’abord le site (ou utilise l’URL finale).
2. Ouvre :
   ```
   https://chart.googleapis.com/chart?cht=qr&chs=800x800&chl=URL_ENCODEE
   ```
3. Télécharge l’image et remplace :
   - `assets/qr-placeholder.png`

### Option B : site tiers
Génère un QR avec un site (format PNG), puis remplace `assets/qr-placeholder.png`.

---

## Tester en local
Option simple (sans outil) :
- Ouvre `index.html` dans le navigateur.

Option recommandée (serveur local) :
```bash
cd aubervilliers-esport
python -m http.server 8080
```
Puis ouvre http://localhost:8080

---

## Déployer sur Netlify (pas-à-pas)
1. Push ce dossier dans un repo GitHub (branche `main`)
2. Netlify → **Add new site** → **Import an existing project**
3. Sélectionne le repo, laisse les paramètres par défaut (site statique)
4. Déploiement terminé → tu obtiens `https://xxxx.netlify.app`
5. Test: envoie une préinscription, vérifie la réception côté Formspree

Optionnel :
- Connecter un domaine (sinon garder le `*.netlify.app`)

---

## Alternative ultra-rapide (Google Form)
Si tu veux éviter Formspree :
1. Crée un Google Form
2. Dans `index.html`, remplace le bouton principal par un lien vers le Google Form
3. Ou intègre l’iframe Google Form (moins “light”, mais simple)

---

## Privacy / Tracking
Par défaut : **aucun tracker**.
- Plausible: OK sans cookie dans beaucoup de cas.
- Google Analytics: nécessite une **gestion de consentement** (RGPD) avant chargement.

Un commentaire dans `index.html` indique où brancher ces scripts.

---

## Checklist tests
- Responsive : mobile / tablette (>=768px) / desktop (>=1024px)
- Formulaire :
  - endpoint Formspree correct
  - réception d’un test
  - checkbox RGPD obligatoire
- Anti-spam :
  - honeypot (champ caché)
  - throttle (attente ~30s entre envois)
- Performance :
  - images optimisées (quand tu remplaces les placeholders)
- Accessibilité :
  - navigation clavier (Tab), focus visible
  - contrastes lisibles

---

## Phrase “Guide d’accueil” (J+0)
“Ici, on joue. On respecte. On kiffe.”

(Imprime un petit doc avec : règles, format, horaires, contact orga, et rappel fair-play.)
