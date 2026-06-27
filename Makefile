# VersusSweeper — build & run helpers
#
# Quick start:
#   cp .env.example .env   # then fill in secrets
#   make dev               # run everything locally with hot reload
#   make prod              # build + run the production stack
#
# Components: backend (Express/Socket.IO), frontend (Next.js), discord (bot).

COMPOSE      ?= docker compose
DEV_FILES    := -f docker-compose.yml -f docker-compose.dev.yml
PROD_FILES   := -f docker-compose.yml

.DEFAULT_GOAL := help

# ---------------------------------------------------------------------------
# Build
# ---------------------------------------------------------------------------
.PHONY: build
build: ## Build all production images
	$(COMPOSE) $(PROD_FILES) build

.PHONY: build-dev
build-dev: ## Build all development images
	$(COMPOSE) $(DEV_FILES) build

# ---------------------------------------------------------------------------
# Development (hot reload + local Redis Stack)
# ---------------------------------------------------------------------------
.PHONY: dev
dev: ## Run the full stack in dev mode (foreground, hot reload)
	$(COMPOSE) $(DEV_FILES) up --build

.PHONY: dev-up
dev-up: ## Run the full stack in dev mode (detached)
	$(COMPOSE) $(DEV_FILES) up --build -d

.PHONY: dev-down
dev-down: ## Stop and remove the dev stack
	$(COMPOSE) $(DEV_FILES) down

.PHONY: dev-logs
dev-logs: ## Tail dev logs
	$(COMPOSE) $(DEV_FILES) logs -f

# ---------------------------------------------------------------------------
# Production
# ---------------------------------------------------------------------------
.PHONY: prod
prod: ## Build + run the production stack (detached)
	$(COMPOSE) $(PROD_FILES) up --build -d

.PHONY: prod-down
prod-down: ## Stop and remove the production stack
	$(COMPOSE) $(PROD_FILES) down

.PHONY: prod-logs
prod-logs: ## Tail production logs
	$(COMPOSE) $(PROD_FILES) logs -f

# ---------------------------------------------------------------------------
# Shared helpers
# ---------------------------------------------------------------------------
.PHONY: ps
ps: ## Show running containers
	$(COMPOSE) ps

.PHONY: down
down: ## Stop everything (dev + prod)
	-$(COMPOSE) $(DEV_FILES) down
	-$(COMPOSE) $(PROD_FILES) down

.PHONY: clean
clean: ## Stop everything and remove images, volumes, and orphans
	-$(COMPOSE) $(DEV_FILES) down --rmi local --volumes --remove-orphans
	-$(COMPOSE) $(PROD_FILES) down --rmi local --volumes --remove-orphans

.PHONY: help
help: ## Show this help
	@awk 'BEGIN {FS = ":.*## "; printf "Available targets:\n"} /^[a-zA-Z0-9_-]+:.*## / {printf "  \033[36m%-12s\033[0m %s\n", $$1, $$2}' $(MAKEFILE_LIST)
