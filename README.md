# 🧠 Health RAG Client

![Angular](https://img.shields.io/badge/Angular-18+-red?logo=angular)
![TypeScript](https://img.shields.io/badge/TypeScript-✔️-blue?logo=typescript)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-✔️-38B2AC?logo=tailwind-css)
![License](https://img.shields.io/badge/license-MIT-green)

> 🎯 **Frontend professionnel** pour une application d'IA médicale basée sur RAG (Retrieval-Augmented Generation)

---

## 📸 Aperçu de l'application

![Dashboard](https://via.placeholder.com/1200x600?text=Dashboard+Preview)
![Chat](https://via.placeholder.com/1200x600?text=AI+Chat+Interface)

---

## ✨ Fonctionnalités principales

* 💬 Chat intelligent avec IA (RAG)
* 🔐 Authentification sécurisée (JWT)
* ⚡ Interface ultra rapide avec Angular Standalone
* 🎨 Design moderne avec Tailwind CSS
* 🔄 Gestion d'état avec Signals
* 🧩 Architecture modulaire scalable

---

## 🛠️ Stack technique

| Technologie  | Description                  |
| ------------ | ---------------------------- |
| Angular 18+  | Framework frontend moderne   |
| TypeScript   | Typage statique robuste      |
| Tailwind CSS | Styling rapide et responsive |
| HttpClient   | Gestion des requêtes API     |
| Signals      | Réactivité moderne Angular   |

---

## 📋 Prérequis

* Node.js **v18+**
* Angular CLI

```bash
npm install -g @angular/cli
```

---

## 🚀 Installation

```bash
# Cloner le projet
git clone https://github.com/votre-username/health-rag-client.git

# Accéder au dossier
cd health-rag-client

# Installer les dépendances
npm install

# Lancer le projet
ng serve
```

👉 Application disponible sur :
http://localhost:4200

---

## 🔌 Configuration Backend

L’application est connectée à une API **FastAPI**.

📍 Fichiers à modifier :

* `src/core/services/rag.service.ts`
* `src/core/services/auth.service.ts`

👉 URL par défaut :

```
http://127.0.0.1:8000/api/v1
```

💡 Recommandé :
Utiliser `environment.ts` pour gérer les environnements (dev / prod)

---

## 🏗️ Architecture du projet

```
src/
│
├── core/
│   ├── services/
│   ├── guards/
│   └── interceptors/
│
├── features/
│   ├── auth/
│   └── dashboard/
│
├── shared/
│
└── app/
```

### 🔹 Concepts clés

* 🚫 No NgModules (Standalone Components)
* ⚡ Signals pour l'état
* 🔐 AuthGuard + JWT Interceptor
* 🧩 Architecture modulaire

---

## 📦 Scripts utiles

```bash
ng serve                     # Dev server
ng build --configuration production   # Build production
ng lint                      # Analyse du code
```

---

## 🔐 Sécurité

* 🔒 AuthGuard protège les routes
* 🔑 JWT injecté automatiquement via Interceptor
* ❌ Aucun mot de passe stocké côté client

---

## 📈 Roadmap

* [ ] Dark mode 🌙
* [ ] Upload documents médicaux
* [ ] Multi-langue 🌍
* [ ] Notifications temps réel 🔔

---

## 🤝 Contribution

Les contributions sont les bienvenues !

```bash
# Fork + PR
```

---

## 📄 Licence

MIT License © 2026

---

## 👨‍💻 Auteur

**RANOELISON Dimbisoa Adrianno**
💼 Data Engineer | Expert Comptable | Dev IA

---
