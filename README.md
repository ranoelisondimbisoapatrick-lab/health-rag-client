Health RAG Client
Frontend professionnel de l'application Health RAG AI. Développé avec Angular 17+, Tailwind CSS et l'architecture Standalone.

📋 Prérequis
Node.js (v18+)
Angular CLI (npm install -g @angular/cli)
🚀 Installation
Cloner le dépôt :
git clone https://github.com/votre-username/health-rag-client.gitcd health-rag-client
Installer les dépendances :
npm install
Lancer le serveur de développement :
ng serve
L'application sera accessible sur http://localhost:4200.

🔌 Connexion Backend
Ce Frontend est conçu pour se connecter à l'API FastAPI correspondante. L'URL de l'API est configurée dans src/core/services/rag.service.ts et src/core/services/auth.service.ts.

Par défaut, elle pointe vers http://127.0.0.1:8000/api/v1.

Pour changer l'URL de production :

Modifiez la variable apiUrl dans les services.
Ou (recommandé) utilisez environment.ts pour gérer les environnements.
🏗️ Architecture
Le projet suit une architecture modulaire moderne :

Standalone Components : Pas de NgModule.
Signals : Gestion d'état réactive pour le chat et les formulaires.
Features : Séparation claire entre Login et Dashboard.
Core : Services globaux (AuthService, RagService, AuthGuard, AuthInterceptor).
Interceptors : Injection automatique du JWT dans l'en-tête Authorization.
🛠️ Stack Technique
Framework : Angular 18+
Langage : TypeScript
Styling : Tailwind CSS (Configuration Standalone)
HTTP : HttpClient avec Interceptors
UI Components : Native Web Components (Pas de Material UI pour la légèreté)
📦 Scripts utiles
ng serve : Lance le serveur de développement.
ng build --configuration production : Compile le projet pour le déploiement.
ng lint : Vérifie la qualité du code.
🔐 Sécurité
Les routes sont protégées par un AuthGuard (auth.guard.ts).
Le AuthInterceptor injecte automatiquement le token JWT stocké dans localStorage.
Les mots de passe ne sont jamais stockés en clair (uniquement le token JWT).