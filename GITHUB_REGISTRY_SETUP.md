# 📦 Guide : Configurer GitHub Container Registry

## Étape par étape pour publier les images Docker

---

## 🔐 Étape 1 : Configurer les Permissions GitHub

### 1.1 Accéder aux paramètres

Va sur : **https://github.com/Anass422/CI_CD_Simple_JEE/settings/actions**

Ou :
1. Ouvre ton repository sur GitHub
2. Clique sur **Settings** (en haut à droite)
3. Dans le menu de gauche, clique sur **Actions** → **General**

### 1.2 Modifier les Workflow Permissions

Scroll vers le bas jusqu'à la section **"Workflow permissions"**

Tu verras deux options :
- ⭕ Read repository contents and packages permissions (par défaut)
- ⭕ Read and write permissions

**Sélectionne** : ✅ **Read and write permissions**

### 1.3 Activer les Pull Requests (optionnel)

Juste en dessous, tu verras :
- ☐ Allow GitHub Actions to create and approve pull requests

**Coche cette case** : ✅

### 1.4 Sauvegarder

Clique sur le bouton vert **"Save"** en bas de la section.

---

## ✅ Étape 2 : Vérifier la Configuration

Une fois sauvegardé, tu devrais voir :
- ✅ Read and write permissions (sélectionné)
- ✅ Allow GitHub Actions to create and approve pull requests (coché)

---

## 🚀 Étape 3 : Activer le Push dans le Workflow

Une fois les permissions configurées, modifie le fichier `.github/workflows/ci-cd-simple.yml` :

### Remplacer cette section :

```yaml
- name: Build all Docker images (verification only)
  run: |
    for service in config-server eureka-server gateway-service product-service order-service client-api react-frontend; do
      echo "Building Docker image for $service..."
      docker build -t ecommerce-$service:latest ./$service
      echo "✅ $service image built successfully"
    done
```

### Par cette section :

```yaml
- name: Log in to GitHub Container Registry
  uses: docker/login-action@v3
  with:
    registry: ghcr.io
    username: ${{ github.actor }}
    password: ${{ secrets.GITHUB_TOKEN }}

- name: Build and push all Docker images
  run: |
    for service in config-server eureka-server gateway-service product-service order-service client-api react-frontend; do
      echo "🔨 Building and pushing $service..."
      docker build -t ghcr.io/anass422/ecommerce-$service:latest ./$service
      docker push ghcr.io/anass422/ecommerce-$service:latest
      echo "✅ $service published successfully"
    done
```

---

## 📊 Étape 4 : Tester

1. **Commit et push** les changements :
   ```bash
   git add .github/workflows/ci-cd-simple.yml
   git commit -m "feat: Enable Docker image publishing"
   git push
   ```

2. **Voir le workflow** : https://github.com/Anass422/CI_CD_Simple_JEE/actions

3. **Vérifier les images** : https://github.com/Anass422?tab=packages

---

## 🎯 Résultat Final

Une fois le workflow terminé, tes images seront disponibles sur :

```
ghcr.io/anass422/ecommerce-config-server:latest
ghcr.io/anass422/ecommerce-eureka-server:latest
ghcr.io/anass422/ecommerce-gateway-service:latest
ghcr.io/anass422/ecommerce-product-service:latest
ghcr.io/anass422/ecommerce-order-service:latest
ghcr.io/anass422/ecommerce-client-api:latest
ghcr.io/anass422/ecommerce-react-frontend:latest
```

### Utiliser les images

```bash
# Pull une image
docker pull ghcr.io/anass422/ecommerce-product-service:latest

# Ou dans docker-compose.yml
services:
  product-service:
    image: ghcr.io/anass422/ecommerce-product-service:latest
```

---

## ❓ Troubleshooting

### Erreur : "denied: installation not allowed to Create organization package"

**Cause** : Les permissions ne sont pas configurées.

**Solution** : Retourne à l'Étape 1 et vérifie que tu as bien sélectionné "Read and write permissions".

### Erreur : "unauthorized: unauthenticated"

**Cause** : Le login GitHub Container Registry a échoué.

**Solution** : Vérifie que le `GITHUB_TOKEN` est bien passé dans le workflow (c'est automatique).

### Les images ne sont pas visibles

**Cause** : Les images peuvent être privées par défaut.

**Solution** : 
1. Va sur https://github.com/Anass422?tab=packages
2. Clique sur une image
3. Clique sur **Package settings**
4. Scroll vers "Danger Zone"
5. Clique sur **Change visibility** → **Public**

---

## 📝 Résumé

1. ✅ Configure les permissions : Settings → Actions → Read and write
2. ✅ Modifie le workflow pour ajouter login + push
3. ✅ Commit et push
4. ✅ Vérifie que les images sont publiées
5. ✅ (Optionnel) Rends les images publiques

**Temps estimé** : 5 minutes

Dis-moi quand tu as configuré les permissions et je t'aiderai à activer le push ! 😊
