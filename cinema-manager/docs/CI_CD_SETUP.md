# GitHub Actions CI/CD Setup Guide

## 🔐 Required GitHub Secrets

To use the CI/CD pipelines, you need to configure the following secrets in your GitHub repository:

**Settings → Secrets and variables → Actions → New repository secret**

### Backend Deployment Secrets

#### For Heroku Deployment
- `HEROKU_API_KEY` - Your Heroku API key (from Account Settings → API Key)
- `HEROKU_APP_NAME` - Your Heroku app name (e.g., cinema-backend-prod)
- `HEROKU_EMAIL` - Your Heroku account email

#### For Railway Deployment
- `RAILWAY_TOKEN` - Your Railway API token (from Railway dashboard → Account → Tokens)

### Frontend Deployment Secrets

#### For Vercel Deployment
- `VERCEL_TOKEN` - Your Vercel authentication token
- `REACT_APP_API_URL` - Your backend API URL (e.g., https://cinema-backend.herokuapp.com/api)
- `REACT_APP_STRIPE_PUBLIC_KEY` - Your Stripe publishable key (pk_live_...)

#### For Netlify Deployment (Alternative)
- `NETLIFY_AUTH_TOKEN` - Your Netlify personal access token
- `NETLIFY_SITE_ID` - Your Netlify site ID

### Docker Secrets (Required for Docker Workflow)
- `DOCKER_USERNAME` - Your Docker Hub username
- `DOCKER_PASSWORD` - Your Docker Hub password or access token (Personal Access Token recommended)

**How to get Docker Hub credentials:**
1. Go to https://hub.docker.com/
2. Login or create an account
3. Go to Account Settings → Security → New Access Token
4. Create a token with Read & Write permissions
5. Save the token (you won't see it again)

### Code Quality & Security (Optional)
- `SONAR_TOKEN` - SonarCloud authentication token
- `SNYK_TOKEN` - Snyk API token for security scanning
- `CODECOV_TOKEN` - Codecov upload token

### Notifications (Optional)
- `SLACK_WEBHOOK` - Slack webhook URL for notifications

---

## 📝 Workflows Overview

### 1. Backend CI/CD (`backend.yml`)
**Triggers:**
- Push to `main` or `develop` branches (backend changes)
- Pull requests to `main` or `develop` (backend changes)

**Jobs:**
- ✅ **Test** - Run Maven tests
- ✅ **Build** - Build JAR file
- ✅ **Deploy to Heroku** - Auto-deploy to Heroku (main branch only)
- ✅ **Deploy to Railway** - Auto-deploy to Railway (main branch only)
- ✅ **Code Quality** - SonarCloud analysis
- ✅ **Security Scan** - Trivy vulnerability scanning

### 2. Frontend CI/CD (`frontend.yml`)
**Triggers:**
- Push to `main` or `develop` branches (frontend changes)
- Pull requests to `main` or `develop` (frontend changes)

**Jobs:**
- ✅ **Test** - Run Jest tests with coverage
- ✅ **Build** - Create production build
- ✅ **Deploy to Vercel** - Auto-deploy to Vercel (main branch only)
- ✅ **Deploy to Netlify** - Alternative deployment
- ✅ **Lighthouse** - Performance audit
- ✅ **Security Scan** - npm audit and Snyk scanning

### 3. Full Stack Integration (`integration.yml`)
**Triggers:**
- Push to `main` branch
- Pull requests to `main`
- Scheduled daily at 2 AM UTC

**Jobs:**
- ✅ **Integration Tests** - Full stack E2E tests with MongoDB
- ✅ **Docker Build** - Build and push Docker images
- ✅ **Notifications** - Send Slack notifications

### 4. Docker Build and Push (`docker.yml`)
**Triggers:**
- Push to `main` or `develop` branches
- Pull requests to `main`
- Releases (published)
- Manual workflow dispatch

**Jobs:**
- ✅ **Build Backend Image** - Multi-platform Docker image for backend
- ✅ **Build Frontend Image** - Multi-platform Docker image for frontend
- ✅ **Scan Images** - Vulnerability scanning with Trivy
- ✅ **Create Manifest** - Multi-architecture manifest
- ✅ **Notifications** - Send build status

**Images Published:**
- `YOUR_DOCKERHUB_USERNAME/cinema-backend:latest`
- `YOUR_DOCKERHUB_USERNAME/cinema-frontend:latest`
- Tagged with: branch name, PR number, commit SHA, semantic version

---

## 🚀 Quick Setup Steps

### Step 1: Enable GitHub Actions
1. Go to your repository on GitHub
2. Click on "Actions" tab
3. If prompted, click "I understand my workflows, go ahead and enable them"

### Step 2: Add Required Secrets

**Minimum required for deployment:**

#### For Heroku Backend:
```bash
HEROKU_API_KEY=your-heroku-api-key
HEROKU_APP_NAME=your-app-name
HEROKU_EMAIL=your-email@example.com
```

#### For Vercel Frontend:
```bash
VERCEL_TOKEN=your-vercel-token
REACT_APP_API_URL=https://your-backend-url.com/api
REACT_APP_STRIPE_PUBLIC_KEY=pk_live_your_key
```

### Step 3: Configure Deployment Platform

#### Heroku Setup
```bash
# Login to Heroku
heroku login

# Create app
heroku create your-app-name

# Get API key
heroku auth:token
```

#### Vercel Setup
```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Get token
vercel tokens create
```

### Step 4: Push to GitHub
```bash
git add .
git commit -m "Add CI/CD pipelines"
git push origin main
```

The workflows will automatically trigger!

---

## 📊 Workflow Status Badges

Add these to your README.md:

```markdown
![Backend CI/CD](https://github.com/yourusername/cinema-manager/workflows/Backend%20CI/CD/badge.svg)
![Frontend CI/CD](https://github.com/yourusername/cinema-manager/workflows/Frontend%20CI/CD/badge.svg)
![Integration Tests](https://github.com/yourusername/cinema-manager/workflows/Full%20Stack%20Integration/badge.svg)
```

---

## 🔧 Customization

### Disable Specific Jobs

Comment out jobs you don't need:

```yaml
# jobs:
#   deploy-railway:  # Comment out if not using Railway
#     name: Deploy to Railway
#     ...
```

### Change Deployment Triggers

Modify the `on:` section:

```yaml
on:
  push:
    branches: [ main, staging, production ]  # Add more branches
```

### Add Environment-Specific Deployments

```yaml
deploy-staging:
  if: github.ref == 'refs/heads/staging'
  # ... staging deployment steps

deploy-production:
  if: github.ref == 'refs/heads/main'
  # ... production deployment steps
```

---

## 🐛 Troubleshooting

### Workflow Fails at Build Step
- Check Java/Node version compatibility
- Verify dependencies are correctly specified
- Check for syntax errors in workflow files

### Deployment Fails
- Verify secrets are correctly set
- Check deployment platform credentials
- Review deployment platform logs

### Tests Failing
- Ensure MongoDB service is healthy
- Check environment variables
- Review test logs in GitHub Actions

### Docker Build Issues
- Verify Dockerfile syntax
- Check for missing dependencies
- Ensure Docker Hub credentials are correct

---

## 📚 Additional Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Heroku CI/CD](https://devcenter.heroku.com/articles/github-integration)
- [Vercel GitHub Integration](https://vercel.com/docs/git/vercel-for-github)
- [Docker Build Push Action](https://github.com/docker/build-push-action)
- [SonarCloud GitHub Action](https://github.com/SonarSource/sonarcloud-github-action)

---

## ✅ Checklist

Before going live, ensure:

- [ ] All required secrets are configured
- [ ] Workflows run successfully on test branch
- [ ] Backend deploys correctly
- [ ] Frontend deploys correctly
- [ ] Integration tests pass
- [ ] Docker images build successfully (if using)
- [ ] Notifications are working (if configured)
- [ ] Status badges are added to README
- [ ] Environment variables are secured
- [ ] Production credentials are not in code

---

**Your CI/CD pipeline is now ready! Every push to main will automatically deploy your application! 🚀**
