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

## Angular Front-end development

Refer to the [Angular instructions](./angular.md) for best practices and guidelines for Angular front-end development.

## Front and back-end interaction

Do not store a compiled version of the front-end in the wwwroot folder of the back-end. Instead, the front-end should be built and served separately from the back-end. The back-end should provide APIs for the front-end to consume, but should not include the front-end code itself in the repository.

When deploying, the front-end shall be compiled and stored in the wwwroot folder of the back-end, but this should be done as part of the deployment process, not as part of the development process. This allows for better separation of concerns and makes it easier to manage and deploy the front-end and back-end independently.
