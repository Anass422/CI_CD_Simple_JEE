# E-Commerce Microservices - Docker Guide

## 🐳 Démarrage Rapide avec Docker

### Prérequis

- Docker 20.10+
- Docker Compose 2.0+
- 8 GB RAM minimum
- 20 GB d'espace disque

### Démarrage de l'application

```bash
# 1. Cloner le repository
git clone <your-repo-url>
cd E-Commerce

# 2. Créer le fichier .env (optionnel)
cp .env.example .env

# 3. Démarrer tous les services
docker-compose up -d

# 4. Vérifier que tous les services sont démarrés
docker-compose ps

# 5. Voir les logs
docker-compose logs -f
```

### Accès aux Services

| Service | URL | Description |
|---------|-----|-------------|
| **Frontend** | http://localhost:3000 | Interface utilisateur React |
| **API Gateway** | http://localhost:8003 | Point d'entrée API |
| **Eureka Dashboard** | http://localhost:8002 | Service Discovery |
| **Config Server** | http://localhost:8001 | Configuration centralisée |
| **Prometheus** | http://localhost:9090 | Métriques |
| **Grafana** | http://localhost:3001 | Dashboards (admin/admin) |

### Services Backend

- **Config Server**: Port 8001
- **Eureka Server**: Port 8002
- **Gateway**: Port 8003
- **Product Service**: Port 8004
- **Order Service**: Port 8005
- **Client API**: Port 8006

## 📊 Observabilité

### Prometheus

Accédez à Prometheus sur http://localhost:9090

**Endpoints de métriques disponibles** :
- Config Server: http://localhost:8001/actuator/prometheus
- Eureka Server: http://localhost:8002/actuator/prometheus
- Gateway: http://localhost:8003/actuator/prometheus
- Product Service: http://localhost:8004/actuator/prometheus
- Order Service: http://localhost:8005/actuator/prometheus
- Client API: http://localhost:8006/actuator/prometheus

**Vérifier les targets** :
- Allez dans Status → Targets pour voir tous les services
- Tous les services doivent être en état "UP"

**Requêtes utiles** :
```promql
# Vérifier que tous les services sont up
up

# Taux de requêtes HTTP par service
sum(rate(http_server_requests_seconds_count[5m])) by (application)

# Utilisation mémoire JVM Heap
jvm_memory_used_bytes{area="heap"} / 1024 / 1024

# Temps de réponse p95
histogram_quantile(0.95, rate(http_server_requests_seconds_bucket[5m])) * 1000

# Nombre de threads actifs
jvm_threads_live_threads

# Connexions DB actives
hikaricp_connections_active

# Erreurs HTTP 5xx
sum(rate(http_server_requests_seconds_count{status=~"5.."}[5m])) by (application)
```

### Grafana

Accédez à Grafana sur http://localhost:3001
- **Username**: admin
- **Password**: admin

**Dashboard pré-configuré** : "E-Commerce Microservices Overview"

**Métriques disponibles** :
- ✅ **Services Status** : État UP/DOWN de chaque service
- 📈 **HTTP Requests Rate** : Taux de requêtes par seconde
- 🔢 **Total Requests** : Nombre total de requêtes traitées
- 💾 **JVM Memory Usage** : Utilisation mémoire Heap (Used vs Max)
- ⏱️ **HTTP Response Time** : Temps de réponse p50 et p95
- 🧵 **JVM Threads** : Threads actifs et daemon
- ❌ **HTTP Errors** : Erreurs 4xx et 5xx
- 🖥️ **CPU Usage** : Utilisation CPU système et processus
- 🗄️ **Database Connection Pool** : Connexions actives/idle/max (HikariCP)
- 🗑️ **Garbage Collection** : Temps passé en GC

**Personnalisation** :
- Les dashboards sont modifiables via l'interface Grafana
- Les changements sont sauvegardés dans le volume `grafana-data`
- Pour exporter : Settings → JSON Model

## 🔧 Commandes Utiles

### Gestion des services

```bash
# Démarrer tous les services
docker-compose up -d

# Arrêter tous les services
docker-compose down

# Arrêter et supprimer les volumes (⚠️ supprime les données)
docker-compose down -v

# Redémarrer un service spécifique
docker-compose restart product-service

# Voir les logs d'un service
docker-compose logs -f product-service

# Reconstruire les images
docker-compose build

# Reconstruire et redémarrer
docker-compose up -d --build
```

### Debugging

```bash
# Vérifier l'état des services
docker-compose ps

# Voir les logs de tous les services
docker-compose logs -f

# Exécuter une commande dans un conteneur
docker-compose exec product-service sh

# Vérifier la santé d'un service
curl http://localhost:8004/actuator/health

# Voir les métriques Prometheus d'un service
curl http://localhost:8004/actuator/prometheus
```

### Nettoyage

```bash
# Supprimer les conteneurs arrêtés
docker-compose rm

# Supprimer les images non utilisées
docker image prune -a

# Nettoyage complet (⚠️ supprime tout)
docker system prune -a --volumes
```

## 🏗️ Build des Images

### Build individuel

```bash
# Build d'un service spécifique
docker build -t ecommerce/config-server ./config-server

# Build avec tag personnalisé
docker build -t ecommerce/product-service:v1.0 ./product-service
```

### Build de tous les services

```bash
# Build de toutes les images
docker-compose build

# Build sans cache
docker-compose build --no-cache
```

## 🔍 Vérification

### Health Checks

```bash
# Config Server
curl http://localhost:8001/actuator/health

# Eureka Server
curl http://localhost:8002/actuator/health

# Gateway
curl http://localhost:8003/actuator/health

# Product Service
curl http://localhost:8004/actuator/health

# Order Service
curl http://localhost:8005/actuator/health

# Client API
curl http://localhost:8006/actuator/health
```

### Tests Fonctionnels

```bash
# Inscription d'un utilisateur
curl -X POST http://localhost:8003/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username":"testuser",
    "email":"test@example.com",
    "password":"Test123!",
    "firstName":"Test",
    "lastName":"User"
  }'

# Récupérer les produits
curl http://localhost:8003/api/products
```

## 🐛 Troubleshooting

### Les services ne démarrent pas

1. Vérifier que Docker est démarré
2. Vérifier les logs : `docker-compose logs`
3. Vérifier l'ordre de démarrage (Config Server → Eureka → autres)
4. Attendre 2-3 minutes pour le premier démarrage

### Erreur de connexion MySQL

```bash
# Vérifier que MySQL est démarré
docker-compose ps mysql

# Voir les logs MySQL
docker-compose logs mysql

# Redémarrer MySQL
docker-compose restart mysql
```

### Service non enregistré dans Eureka

1. Vérifier que Eureka est démarré : http://localhost:8002
2. Vérifier les logs du service
3. Attendre 30 secondes (délai d'enregistrement)
4. Redémarrer le service

### Erreur Config Server

```bash
# Vérifier que le Config Server peut accéder à GitHub
docker-compose logs config-server

# Tester l'accès aux configurations
curl http://localhost:8001/product-service/default
```

## 📦 Volumes Docker

Les données persistantes sont stockées dans des volumes Docker :

- `mysql-data`: Données MySQL
- `prometheus-data`: Métriques Prometheus
- `grafana-data`: Dashboards Grafana

**⚠️ Attention** : `docker-compose down -v` supprimera toutes ces données !

## 🚀 Déploiement en Production

### Recommandations

1. **Sécurité** :
   - Changer les mots de passe par défaut
   - Utiliser des secrets Docker
   - Activer HTTPS/TLS

2. **Performance** :
   - Ajuster les limites de ressources
   - Configurer le scaling horizontal
   - Optimiser les health checks

3. **Monitoring** :
   - Configurer les alertes Grafana
   - Mettre en place des logs centralisés
   - Surveiller les métriques

### Variables d'environnement

Créer un fichier `.env` basé sur `.env.example` :

```bash
cp .env.example .env
# Éditer .env avec vos valeurs
```

## 📝 Notes

- Premier démarrage : 2-3 minutes
- Les services dépendent de Config Server et Eureka
- Les health checks garantissent l'ordre de démarrage
- Les configurations sont récupérées depuis GitHub

---

**Besoin d'aide ?** Consultez les logs : `docker-compose logs -f`
