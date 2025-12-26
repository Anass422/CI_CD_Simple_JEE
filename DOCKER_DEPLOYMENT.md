# 🚀 Guide de Déploiement Docker - E-Commerce Microservices

## Prérequis

- ✅ Docker Desktop installé et démarré
- ✅ XAMPP avec MySQL démarré (ou utiliser MySQL dans Docker)
- ✅ Ports disponibles : 8001-8006, 3000, 3001, 9090

---

## 🏗️ Architecture du Projet

```
E-Commerce/
├── config-server/          (Port 8001)
├── eureka-server/          (Port 8002)
├── gateway-service/        (Port 8003)
├── product-service/        (Port 8004)
├── order-service/          (Port 8005)
├── client-api/             (Port 8006)
├── react-frontend/         (Port 3000)
├── prometheus/             (Port 9090)
├── grafana/                (Port 3001)
└── docker-compose.yml
```

---

## 📋 Étapes de Déploiement

### Étape 1 : Vérifier que Docker est prêt

```bash
# Vérifier que Docker fonctionne
docker --version
docker-compose --version

# Vérifier qu'aucun conteneur ne tourne
docker ps
```

### Étape 2 : Démarrer MySQL (XAMPP)

1. Ouvrir **XAMPP Control Panel**
2. Démarrer **MySQL**
3. Vérifier que MySQL tourne sur le port **3306**

### Étape 3 : Créer les bases de données

```sql
-- Ouvrir phpMyAdmin (http://localhost/phpmyadmin)
-- Exécuter ces commandes :

CREATE DATABASE IF NOT EXISTS product_db;
CREATE DATABASE IF NOT EXISTS order_db;
CREATE DATABASE IF NOT EXISTS client_db;
```

### Étape 4 : Build les images Docker

```bash
cd c:\Data\eclipse-workspace\E-Commerce

# Build toutes les images
docker-compose build

# Ou build une image spécifique
docker-compose build config-server
```

**Temps estimé** : ~10-15 minutes (première fois)

### Étape 5 : Démarrer tous les services

```bash
# Démarrer tous les services en arrière-plan
docker-compose up -d

# Ou démarrer avec les logs visibles
docker-compose up
```

### Étape 6 : Vérifier que tout fonctionne

```bash
# Voir les conteneurs en cours
docker ps

# Voir les logs d'un service
docker-compose logs -f config-server
docker-compose logs -f eureka-server
docker-compose logs -f product-service

# Vérifier le statut de santé
docker-compose ps
```

**Tous les conteneurs doivent être "healthy"** ✅

---

## 🔍 Vérification des Services

### 1. Config Server (Port 8001)
```
http://localhost:8001/actuator/health
```
Réponse attendue : `{"status":"UP"}`

### 2. Eureka Server (Port 8002)
```
http://localhost:8002
```
Tu devrais voir le dashboard Eureka avec tous les services enregistrés.

### 3. Gateway Service (Port 8003)
```
http://localhost:8003/actuator/health
```

### 4. Product Service (Port 8004)
```
http://localhost:8004/products
```
Devrait retourner la liste des produits.

### 5. Order Service (Port 8005)
```
http://localhost:8005/actuator/health
```

### 6. Client API (Port 8006)
```
http://localhost:8006/actuator/health
```

### 7. React Frontend (Port 3000)
```
http://localhost:3000
```
L'interface utilisateur devrait s'afficher.

### 8. Prometheus (Port 9090)
```
http://localhost:9090
```
Dashboard Prometheus avec les métriques.

### 9. Grafana (Port 3001)
```
http://localhost:3001
```
- **Username** : admin
- **Password** : admin

---

## 🛠️ Commandes Utiles

### Gestion des services

```bash
# Arrêter tous les services
docker-compose down

# Arrêter et supprimer les volumes (données perdues)
docker-compose down -v

# Redémarrer un service spécifique
docker-compose restart product-service

# Voir les logs en temps réel
docker-compose logs -f

# Voir les logs d'un service spécifique
docker-compose logs -f product-service
```

### Rebuild après modification du code

```bash
# Rebuild et redémarrer un service
docker-compose up -d --build product-service

# Rebuild tous les services
docker-compose up -d --build
```

### Accéder à un conteneur

```bash
# Ouvrir un shell dans un conteneur
docker exec -it ecommerce-product-service sh

# Voir les fichiers
docker exec ecommerce-product-service ls -la
```

---

## 🐛 Troubleshooting

### Problème 1 : Les services ne démarrent pas

**Solution** :
```bash
# Voir les logs pour identifier l'erreur
docker-compose logs

# Vérifier que MySQL (XAMPP) est démarré
# Vérifier que les ports ne sont pas utilisés
netstat -ano | findstr :8001
```

### Problème 2 : "Connection refused" à MySQL

**Cause** : Les services Docker ne peuvent pas se connecter à MySQL sur l'hôte.

**Solution** :
Dans `docker-compose.yml`, vérifier que l'adresse MySQL est correcte :
```yaml
SPRING_DATASOURCE_URL: jdbc:mysql://host.docker.internal:3306/product_db
```

### Problème 3 : Config Server ne trouve pas config-repo

**Solution** :
Vérifier que le volume est bien monté dans `docker-compose.yml` :
```yaml
volumes:
  - ./config-repo:/config-repo
```

### Problème 4 : Les services ne s'enregistrent pas dans Eureka

**Solution** :
1. Vérifier que Eureka est démarré : `http://localhost:8002`
2. Attendre 30-60 secondes (temps d'enregistrement)
3. Vérifier les logs : `docker-compose logs eureka-server`

### Problème 5 : Frontend ne peut pas appeler le backend

**Cause** : Problème CORS ou Gateway non accessible.

**Solution** :
1. Vérifier que Gateway fonctionne : `http://localhost:8003/actuator/health`
2. Vérifier la configuration CORS dans `config-repo/gateway-service.properties`

---

## 🔄 Ordre de Démarrage Recommandé

Si tu veux démarrer les services un par un :

```bash
# 1. Config Server (doit démarrer en premier)
docker-compose up -d config-server
sleep 30

# 2. Eureka Server
docker-compose up -d eureka-server
sleep 30

# 3. Gateway Service
docker-compose up -d gateway-service
sleep 20

# 4. Services métier
docker-compose up -d product-service order-service client-api
sleep 20

# 5. Frontend
docker-compose up -d react-frontend

# 6. Monitoring (optionnel)
docker-compose up -d prometheus grafana
```

---

## 📊 Monitoring avec Prometheus & Grafana

### Accéder à Prometheus
```
http://localhost:9090
```

**Requêtes utiles** :
```
# Nombre de requêtes HTTP
http_server_requests_seconds_count

# Utilisation mémoire JVM
jvm_memory_used_bytes

# Statut des services
up
```

### Accéder à Grafana
```
http://localhost:3001
```

1. Login : **admin** / **admin**
2. Aller dans **Dashboards**
3. Ouvrir **E-Commerce Microservices Overview**

---

## 🧹 Nettoyage après utilisation

```bash
# Arrêter tous les services
docker-compose down

# Arrêter et supprimer les volumes
docker-compose down -v

# Nettoyer complètement Docker
docker system prune -a --volumes
```

---

## 💡 Conseils

1. **Première fois** : Le premier build prend ~15 min, les suivants ~2-3 min
2. **Logs** : Toujours vérifier les logs si un service ne démarre pas
3. **Ordre** : Config Server → Eureka → Gateway → Services → Frontend
4. **Patience** : Attendre 1-2 minutes que tous les services s'enregistrent dans Eureka
5. **Ports** : Vérifier qu'aucun autre programme n'utilise les ports 8001-8006, 3000, 3001, 9090

---

## 🎯 Checklist de Déploiement

- [ ] Docker Desktop démarré
- [ ] MySQL (XAMPP) démarré
- [ ] Bases de données créées (product_db, order_db, client_db)
- [ ] `docker-compose build` exécuté
- [ ] `docker-compose up -d` exécuté
- [ ] Tous les conteneurs "healthy" (`docker ps`)
- [ ] Config Server accessible (http://localhost:8001/actuator/health)
- [ ] Eureka Dashboard accessible (http://localhost:8002)
- [ ] Tous les services enregistrés dans Eureka
- [ ] Frontend accessible (http://localhost:3000)
- [ ] Prometheus accessible (http://localhost:9090)
- [ ] Grafana accessible (http://localhost:3001)

**Si toutes les cases sont cochées, le déploiement est réussi ! ✅**

---

## 📞 Support

En cas de problème :
1. Vérifier les logs : `docker-compose logs`
2. Vérifier le statut : `docker-compose ps`
3. Redémarrer un service : `docker-compose restart <service>`
4. Rebuild si nécessaire : `docker-compose up -d --build`

**Temps total de déploiement** : ~15-20 minutes (première fois), ~5 minutes (fois suivantes)
