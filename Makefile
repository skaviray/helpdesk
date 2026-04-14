TEST_DB_URL := postgresql://root:root@localhost:5437/ticketing_test?schema=public
TEST_COMPOSE := docker-compose.test.yaml

# ==============================================================================
# Development
# ==============================================================================

.PHONY: start-db
start-db: ## Start the dev database
	docker compose up -d

.PHONY: start-backend
start-backend: ## Start the backend dev server
	bun run dev:backend

.PHONY: start-frontend
start-frontend: ## Start the frontend dev server
	bun run dev:frontend

.PHONY: dev
dev: start-db ## Start dev database and all services
	bun run dev

# ==============================================================================
# E2E Testing
# ==============================================================================

.PHONY: test-db-up
test-db-up: ## Start the test database container
	docker compose -f $(TEST_COMPOSE) up -d --wait

.PHONY: test-db-down
test-db-down: ## Stop and remove the test database container
	docker compose -f $(TEST_COMPOSE) down

.PHONY: test-db-reset
test-db-reset: ## Destroy test database volume and recreate
	docker compose -f $(TEST_COMPOSE) down -v
	docker compose -f $(TEST_COMPOSE) up -d --wait

.PHONY: test-db-migrate
test-db-migrate: ## Run Prisma migrations against test database
	cd backend && DATABASE_URL="$(TEST_DB_URL)" bunx prisma migrate deploy

.PHONY: test-db-seed
test-db-seed: ## Seed the test database
	cd backend && DATABASE_URL="$(TEST_DB_URL)" bun run seed

.PHONY: test-db-prepare
test-db-prepare: test-db-up test-db-migrate test-db-seed ## Start test DB, migrate, and seed

.PHONY: test-e2e
test-e2e: ## Run Playwright tests (assumes test DB and servers are ready)
	cd e2e && bunx playwright test

.PHONY: test-e2e-ui
test-e2e-ui: ## Run Playwright tests with interactive UI mode
	cd e2e && bunx playwright test --ui

.PHONY: test-e2e-headed
test-e2e-headed: ## Run Playwright tests in headed browser
	cd e2e && bunx playwright test --headed

.PHONY: test
test: test-db-reset test-db-migrate test-db-seed test-e2e ## Full E2E: reset DB, migrate, seed, run tests

.PHONY: test-report
test-report: ## Open the Playwright HTML report
	cd e2e && bunx playwright show-report

# ==============================================================================
# Help
# ==============================================================================

.PHONY: help
help: ## Show this help
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

.DEFAULT_GOAL := help
