# E-Commerce Microservices Application

![CI/CD](https://github.com/Anass422/E-Commerce/workflows/CI/CD%20Simple/badge.svg)
![Docker](https://img.shields.io/badge/docker-ready-blue)
![Java](https://img.shields.io/badge/java-21-orange)
![Spring Boot](https://img.shields.io/badge/spring%20boot-3.5.8-green)

Application e-commerce complète basée sur une architecture microservices avec Spring Cloud.

**📊 Monitoring** : [Prometheus](http://localhost:9090) | [Grafana](http://localhost:3001) | [Eureka](http://localhost:8002)  
**📖 Documentation** : [CI/CD Guide](CI_CD_GUIDE.md) | [Docker Guide](DOCKER_README.md)

## 🏗️ Architecture

- **Java 21** + **Spring Boot 3.5.8** + **Spring Cloud 2024.0.0**
- **7 Microservices** avec découverte de services et configuration centralisée
- **MySQL** via XAMPP (3 bases de données)
- **Authentification complète** avec JWT et vérification email
- **Frontend Thymeleaf** avec Bootstrap 5

## 📦 Services

| Service | Port | Description | Configuration |
|---------|------|-------------|---------------|
| Config Server | 8001 | Centralisation des configurations (GitHub) | application.properties |
| Eureka Server | 8002 | Service Discovery | bootstrap.properties |
| Gateway | 8003 | Point d'entrée API avec routing | bootstrap.properties |
| Product Service | 8004 | Gestion catalogue produits | bootstrap.properties |
| Order Service | 8005 | Gestion commandes & panier | bootstrap.properties |
| Client API | 8006 | API REST + Authentification JWT | bootstrap.properties |
| Frontend | 8080 | Interface utilisateur Thymeleaf | bootstrap.properties |

## 🚀 Démarrage Rapide

### Prérequis

1. **Java 21** installé
2. **Maven** installé
3. **XAMPP** avec MySQL démarré
4. **Git** installé
5. **Compte GitHub** (pour le config repository)

### Étape 1 : Configuration GitHub

Le repository de configuration est hébergé sur GitHub :
- **URL** : https://github.com/Anass422/Jee-Controle-Config-Repo.git
- **Branch** : main

### Étape 2 : Démarrer MySQL

```bash
# Démarrer XAMPP et lancer MySQL
# Les bases de données seront créées automatiquement :
# - ecommerce_products
# - ecommerce_orders
# - ecommerce_users
```

### Étape 3 : Démarrer les services (dans l'ordre)

**1. Config Server** (port 8001)
```bash
cd config-server
mvn spring-boot:run
```
✅ Vérifier : http://localhost:8001/product-service/default

**2. Eureka Server** (port 8002)
```bash
cd eureka-server
mvn spring-boot:run
```
✅ Vérifier : http://localhost:8002

**3. Gateway** (port 8003)
```bash
cd gateway-service
mvn spring-boot:run
```

**4. Product Service** (port 8004)
```bash
cd product-service
mvn spring-boot:run
```

**5. Order Service** (port 8005)
```bash
cd order-service
mvn spring-boot:run
```

**6. Client API** (port 8006)
```bash
cd client-api
mvn spring-boot:run
```

**7. Frontend** (port 8080)
```bash
cd frontend-service
mvn spring-boot:run
```

### Étape 4 : Accéder à l'application

- **Application Web** : http://localhost:8080
- **Eureka Dashboard** : http://localhost:8002
- **API Gateway** : http://localhost:8003/api/...
- **Config Server** : http://localhost:8001

## 📁 Structure de Configuration

Chaque service utilise **uniquement `bootstrap.properties`** pour se connecter au Config Server :

```properties
spring.application.name=service-name
spring.cloud.config.uri=http://localhost:8001
spring.cloud.config.fail-fast=true
```

**Exception** : Le Config Server utilise `application.properties` car il ne se connecte pas à lui-même.

Toutes les autres configurations sont centralisées dans le repository GitHub.

## 🔑 Fonctionnalités Clés

### Authentification Complète
- ✅ Inscription utilisateur avec validation
- ✅ Cryptage BCrypt des mots de passe
- ✅ Vérification email automatique (Gmail SMTP)
- ✅ Authentification JWT
- ✅ Rôles USER/ADMIN

### Configuration Personnalisée
- ✅ Propriété `mes-config-ms.commandes-last=10`
- ✅ Endpoint `/api/orders/recent` pour les commandes des N derniers jours
- ✅ Configuration centralisée via GitHub

### Communication Inter-Services
- ✅ OpenFeign pour appels REST
- ✅ Validation produits avant ajout au panier
- ✅ Vérification stock avant commande
- ✅ Circuit Breaker avec Resilience4j

## 📡 API Endpoints

### Authentication (Public)
```bash
POST /api/auth/register    # Inscription
GET  /api/auth/verify      # Vérification email
POST /api/auth/login       # Connexion (retourne JWT)
```

### Products
```bash
GET    /api/products              # Liste produits
GET    /api/products/{id}         # Détail produit
POST   /api/products              # Créer produit (admin)
PUT    /api/products/{id}         # Modifier produit (admin)
DELETE /api/products/{id}         # Supprimer produit (admin)
GET    /api/products/search?name= # Rechercher produits
GET    /api/categories            # Liste catégories
```

### Orders & Cart
```bash
GET    /api/orders/recent         # Commandes récentes (config property)
GET    /api/orders/user/{userId}  # Commandes utilisateur
POST   /api/orders/user/{userId}  # Créer commande depuis panier
GET    /api/cart/user/{userId}    # Voir panier
POST   /api/cart/items            # Ajouter au panier
DELETE /api/cart/items/{id}       # Retirer du panier
```

## 🧪 Test de l'Application

### 1. Inscription et Vérification
```bash
# Inscription
curl -X POST http://localhost:8003/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username":"testuser",
    "email":"test@example.com",
    "password":"Test123!",
    "firstName":"Test",
    "lastName":"User"
  }'

# Vérifier l'email reçu et cliquer sur le lien
# Ou utiliser le token depuis la base de données

# Login
curl -X POST http://localhost:8003/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"Test123!"}'
```

### 2. Tester la Propriété Personnalisée
```bash
# Obtenir les commandes des 10 derniers jours
curl http://localhost:8003/api/orders/recent \
  -H "Authorization: Bearer <votre-token>"
```

### 3. Vérifier Eureka
Ouvrir http://localhost:8002 et vérifier que tous les services sont enregistrés.

## 📊 Monitoring

- **Actuator** : Tous les services exposent `/actuator/health`
- **Eureka Dashboard** : http://localhost:8002
- **Config Server** : http://localhost:8001/{service-name}/default

## 🔧 Configuration Centralisée

### Repository GitHub
- **URL** : https://github.com/Anass422/Jee-Controle-Config-Repo.git
- **Fichiers** :
  - `application.properties` - Configuration commune
  - `eureka-server.properties`
  - `gateway-service.properties`
  - `product-service.properties`
  - `order-service.properties` - **Contient mes-config-ms.commandes-last=10**
  - `client-api.properties` - JWT + Email SMTP
  - `frontend-service.properties`

### Rafraîchissement Dynamique

Pour mettre à jour une configuration sans redémarrer :

1. Modifier le fichier dans GitHub
2. Commit et push
3. Appeler l'endpoint refresh :
```bash
curl -X POST http://localhost:8005/actuator/refresh
```

## 📧 Configuration Email

L'application utilise Gmail SMTP pour l'envoi d'emails de vérification :
- **Host** : smtp.gmail.com
- **Port** : 587
- **Email** : a.elghazoui2000@gmail.com
- **App Password** : Configuré dans client-api.properties

## 🐛 Dépannage

### MySQL Connection Error
```bash
# Vérifier que XAMPP MySQL est démarré
# Vérifier le port 3306
```

### Service ne démarre pas
```bash
# Vérifier que Config Server (8001) est démarré en premier
# Vérifier que Eureka (8002) est démarré ensuite
# Vérifier les logs dans la console
```

### Config Server ne trouve pas les configurations
```bash
# Vérifier que le repository GitHub est accessible
# Vérifier l'URL dans config-server/src/main/resources/application.properties
# Vérifier que la branche est "main" et non "master"
```

### Email non reçu
```bash
# Vérifier les logs du client-api
# Vérifier la configuration SMTP dans le repository GitHub
# Vérifier que l'app password Gmail est valide
```

## 📝 Notes Importantes

1. **Ordre de démarrage** : Config Server → Eureka → Gateway → Services
2. **XAMPP** : MySQL doit être démarré avant les services
3. **Configuration** : Tous les services utilisent uniquement `bootstrap.properties`
4. **GitHub** : Le Config Server récupère les configurations depuis GitHub
5. **Email** : Les emails de vérification sont envoyés automatiquement
6. **JWT** : Token valide pendant 24 heures
7. **Propriété personnalisée** : `mes-config-ms.commandes-last` dans order-service.properties

## 👨‍💻 Développé avec

- Spring Boot 3.5.8
- Spring Cloud 2024.0.0
- Java 21
- MySQL 8
- Thymeleaf
- Bootstrap 5
- JWT (jjwt)
- BCrypt
- OpenFeign
- Resilience4j
- GitHub (Config Repository)

---

**Bon développement ! 🚀**
