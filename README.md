# Common Components

Common Components has two purposes for the time being:

1. Component Library
2. CMS

## Component Library

It's a library of components that are used across all client projects.
- Its production branch is `main`
- Its development branch is `develop`


## CMS

Utilizes Builder.io to register custom components.

- Its production branch is `builder-main`
- Its development branch is `builder-dev`


## Git Branching Strategy
- For each feature, a new branch is created from `develop` or `builder-dev`, naming it `feature/feature-name`.
- If there are changes in `develop` or `builder-dev` that you need to merge into your feature branch, you can do so by rebasing your feature branch on top of `develop` or `builder-dev`.
- When a feature is complete, it is merged into `develop` or `builder-dev` via an MR with the squash and delete source branch options enabled.
- When a feature is ready to be deployed, it is merged into `main` or `builder-main` via an MR.

## Commit Messages

- When committing we follow the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) specification.
- We use the following prefixes:
  - `build`: Changes that affect the build system or external dependencies (example scopes: gulp, broccoli, npm)
  - `ci`: Changes to our CI configuration files and scripts (example scopes: Gitlab CI, Travis, Circle, BrowserStack, SauceLabs)
  - `docs`: Documentation only changes
  - `feat`: A new feature
  - `fix`: A bug fix
  - `perf`: A code change that improves performance
  - `refactor`: A code change that neither fixes a bug nor adds a feature
  - `style`: Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)
  - `test`: Adding missing tests or correcting existing tests
  
## Using The Component Library in Another Project

In order to import it into you project first you should reference it in your package.json.

```json
"dependencies": {
    // ... Other dependencies
    "common-components": "file:../common-components"
}
```

Make sure to have the corrent path in your local - default behavior is to have the common-components project to be in the same root alongside with the client projects.

Import your common module (page, component) into the relevant place.

```javascript
// app/page.js - (Home route)
import Home from 'common-components/dist/common/page'

export default function Handler() {
    return <Home />
}
```
## How to Tag a Release

1. Update the version in the package.json file
2. Run `npm i` to update the package-lock.json file
2. Commit the changes
3. Push the changes to the remote repository
4. Tag the release with `git tag vx.y.z`
5. Push the tag to the remote repository with `git push --tags`