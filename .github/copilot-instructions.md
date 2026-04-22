# Copilot instructions

## Versioning

Use semantic versioning for all releases. The version number should be in the format of `MAJOR.MINOR.PATCH`.

## Commit messages

Use conventional commit messages for all commits. The format should be `<type>(<scope>): <description>`, where:
- `<type>` is the type of change (e.g., `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`).
- `<scope>` is the scope of the change (e.g., `auth`, `ui`, `api`).
- `<description>` is a brief description of the change.

## General way of working with source control

As an AI agent, you are allowed to work on the `devel` branch, feature (`feat`) branches and fix (`fix`) branches.

All new developments should be done in a feature branch, which should be created from the `devel` branch. The naming convention for feature branches is `feat/<feature-name>`. For example, if you are working on a new login feature, you could create a branch named `feat/login`.

All bug fixes should be done in a fix branch, which should also be created from the `devel` branch. The naming convention for fix branches is `fix/<bug-name>`. For example, if you are fixing a bug related to user registration, you could create a branch named `fix/registration-bug`.

Before starting work on a new feature or bug fix, make sure to pull the latest changes from the `devel` branch to ensure you are working with the most up-to-date code.

Once development or bug fixing is complete, you should merge your changes to the `devel` branch. Code must compile and any valid tests must pass before merging. 

Once merged, also push the `devel` branch to the origin repository.

Merges from the `devel` branch to the `main` branch should be done by a human, after testing and review.

## Data Migrations

Data migrations should be prepared for developers to run locally.
SQL scripts should be provided for DB changes to allow production DB changes to be made by a human, after testing and review.
