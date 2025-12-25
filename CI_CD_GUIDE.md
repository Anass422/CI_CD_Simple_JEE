# Guide CI/CD Simple - GitHub Actions

## 🚀 Démarrage Rapide

Ton projet a maintenant un pipeline CI/CD automatique qui se déclenche à chaque push !

### Ce qui se passe automatiquement

#### Sur chaque Push ou Pull Request
1. ✅ **Build** de tous les microservices Java
2. ✅ **Tests** automatiques
3. ✅ **Build** du frontend React

#### Sur Push vers `main` uniquement
4. ✅ **Build Docker** de toutes les images
5. ✅ **Push** vers GitHub Container Registry (ghcr.io)

---

## 📋 Prérequis

### Aucune configuration nécessaire ! 

Le workflow utilise `GITHUB_TOKEN` qui est automatiquement fourni par GitHub.

---

## 🎯 Comment ça marche

### 1. Push ton code
```bash
git add .
git commit -m "Mon changement"
git push origin main
```

### 2. Voir le workflow
1. Va sur GitHub → Onglet **Actions**
2. Tu verras le workflow en cours d'exécution
3. Clique dessus pour voir les détails

### 3. Vérifier les images Docker
Les images sont publiées sur :
```
ghcr.io/TON_USERNAME/ecommerce-config-server:latest
ghcr.io/TON_USERNAME/ecommerce-eureka-server:latest
ghcr.io/TON_USERNAME/ecommerce-gateway-service:latest
ghcr.io/TON_USERNAME/ecommerce-product-service:latest
ghcr.io/TON_USERNAME/ecommerce-order-service:latest
ghcr.io/TON_USERNAME/ecommerce-client-api:latest
ghcr.io/TON_USERNAME/ecommerce-react-frontend:latest
```

---

## 🔍 Statut du Build

### Ajouter un badge dans ton README

Copie-colle ceci en haut de ton `README.md` :

```markdown
![CI/CD](https://github.com/TON_USERNAME/TON_REPO/workflows/CI/CD%20Simple/badge.svg)
```

Remplace `TON_USERNAME` et `TON_REPO` par tes valeurs.

---

## 🐳 Utiliser les images Docker

### Pull une image
```bash
docker pull ghcr.io/TON_USERNAME/ecommerce-product-service:latest
```

### Modifier docker-compose.yml pour utiliser les images
```yaml
services:
  product-service:
    image: ghcr.io/TON_USERNAME/ecommerce-product-service:latest
    # Au lieu de build: ./product-service
```

---

## 🛠️ Personnalisation

### Désactiver les tests (temporairement)
Dans `.github/workflows/ci-cd-simple.yml`, change :
```yaml
./mvnw test || true
```
en :
```yaml
./mvnw test -DskipTests
```

### Build seulement certains services
Modifie la boucle `for service in ...` pour inclure seulement les services que tu veux.

---

## ❓ Troubleshooting

### Le build échoue
1. Vérifie les logs dans l'onglet **Actions**
2. Clique sur le job qui a échoué
3. Lis les erreurs en rouge

### Les images Docker ne se publient pas
1. Vérifie que tu es sur la branche `main`
2. Vérifie que le job `build-and-test` a réussi
3. Vérifie les permissions du token dans Settings → Actions → General

### Les tests échouent
Le workflow continue même si les tests échouent (grâce à `|| true`).
Pour les rendre obligatoires, enlève `|| true`.

---

## 📊 Prochaines étapes (optionnel)

Si tu veux aller plus loin :

1. **Déploiement automatique** : Ajouter un job pour déployer sur un serveur
2. **Quality Gates** : Ajouter SonarCloud pour l'analyse de code
3. **Notifications** : Recevoir des emails ou Slack quand le build échoue
4. **Environnements** : Créer des environnements staging/production

---

## 🎉 C'est tout !

Ton CI/CD est maintenant opérationnel. À chaque push, GitHub va :
- ✅ Compiler ton code
- ✅ Lancer les tests
- ✅ Créer les images Docker
- ✅ Les publier automatiquement

**Aucune autre configuration nécessaire !**
