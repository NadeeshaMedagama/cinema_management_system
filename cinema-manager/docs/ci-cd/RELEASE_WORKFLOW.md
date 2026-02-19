# 🚀 Release Workflow Guide

## Overview

The release workflow automates the process of creating releases for the Cinema Management System. It handles:
- Building and testing the backend (Java/Spring Boot)
- Building the frontend (React)
- Building and pushing Docker images
- Creating GitHub releases with artifacts

## Triggering a Release

### Method 1: Git Tag (Recommended)

Create and push a version tag to trigger an automatic release:

```bash
# Create a release tag
git tag v1.0.0

# Push the tag to GitHub
git push origin v1.0.0
```

**Version Format:**
- Release: `v1.0.0`, `v2.1.0`, `v3.0.5`
- Pre-release: `v1.0.0-alpha`, `v1.0.0-beta.1`, `v1.0.0-rc.1`

### Method 2: Manual Workflow Dispatch

1. Go to **Actions** tab in GitHub
2. Select **Release** workflow
3. Click **Run workflow**
4. Enter the version number (e.g., `1.0.0`)
5. Check "Is this a pre-release?" if applicable
6. Click **Run workflow**

## What the Workflow Does

### 1. Prepare Release
- Extracts version from tag or manual input
- Determines if it's a pre-release

### 2. Build Backend
- Sets up JDK 21
- Updates version in `pom.xml`
- Builds the JAR file
- Runs tests
- Uploads artifact

### 3. Build Frontend
- Sets up Node.js 18
- Updates version in `package.json`
- Installs dependencies
- Builds production bundle
- Creates archive
- Uploads artifact

### 4. Build Docker Images
- Builds multi-architecture images (amd64/arm64)
- Pushes to Docker Hub with version tags
- Tags images as `latest`

### 5. Create GitHub Release
- Downloads build artifacts
- Generates changelog from commits
- Creates GitHub release
- Attaches downloadable artifacts

## Required Secrets

Configure these secrets in **Settings > Secrets and variables > Actions**:

| Secret | Description | Required |
|--------|-------------|----------|
| `DOCKER_USERNAME` | Docker Hub username | Yes |
| `DOCKER_PASSWORD` | Docker Hub password/token | Yes |
| `REACT_APP_API_URL` | Backend API URL for frontend build | No |

> Note: `GITHUB_TOKEN` is automatically provided by GitHub Actions.

## Release Artifacts

Each release includes:

| Artifact | Description |
|----------|-------------|
| `cinema-backend-{version}.jar` | Runnable Spring Boot JAR |
| `cinema-frontend-{version}.tar.gz` | Production frontend build |

## Docker Images

Each release creates Docker images:

```bash
# Backend
docker pull {username}/cinema-backend:{version}
docker pull {username}/cinema-backend:latest

# Frontend
docker pull {username}/cinema-frontend:{version}
docker pull {username}/cinema-frontend:latest
```

## Release Versioning

We follow [Semantic Versioning](https://semver.org/):

```
MAJOR.MINOR.PATCH

MAJOR - Breaking changes
MINOR - New features (backwards compatible)
PATCH - Bug fixes (backwards compatible)
```

**Examples:**
- `v1.0.0` - First stable release
- `v1.1.0` - New feature added
- `v1.1.1` - Bug fix
- `v2.0.0` - Breaking changes
- `v2.0.0-beta.1` - Pre-release

## Quick Reference

### Create a Release

```bash
# 1. Make sure you're on master branch with latest changes
git checkout master
git pull origin master

# 2. Create a tag
git tag v1.0.0

# 3. Push the tag
git push origin v1.0.0

# 4. Watch the workflow in GitHub Actions
```

### Create a Pre-release

```bash
git tag v1.0.0-beta.1
git push origin v1.0.0-beta.1
```

### Delete a Tag (if needed)

```bash
# Delete local tag
git tag -d v1.0.0

# Delete remote tag
git push origin :refs/tags/v1.0.0
```

## Workflow File

The workflow is defined in:
```
.github/workflows/release.yml
```

## Troubleshooting

### Docker Push Fails
- Verify `DOCKER_USERNAME` and `DOCKER_PASSWORD` secrets
- Ensure Docker Hub account has repository access

### Build Fails
- Check the specific job logs in GitHub Actions
- Ensure tests pass locally before releasing

### Version Already Exists
- Each version tag must be unique
- Delete the existing tag or use a new version

## Related Workflows

| Workflow | Purpose | Trigger |
|----------|---------|---------|
| `backend.yml` | Backend CI/CD | Push to master/develop |
| `frontend.yml` | Frontend CI/CD | Push to master/develop |
| `docker.yml` | Docker builds | Push/PR/Release |
| `integration.yml` | Integration tests | Push to master/develop |
| `release.yml` | Create releases | Version tags |

---

**Last Updated:** February 18, 2026
