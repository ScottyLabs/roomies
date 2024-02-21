# Roomies!

This is a quick project I made to facilitate finding roommates at Carnegie Mellon University, for students old and anew.

Suggestions and bug reports are greatly appreciated.

# How To Run:

Populate `.env`. Then run

```
 yarn
 npx prisma db push
 yarn dev
```

If yarn doesn't work

```
For Windows: `npm install --global yarn`
For Mac:
 - Install brew: https://brew.sh/
 - Install yarn: `brew install yarn` in terminal
```

If you encounter linting errors when building the project, run

```
yarn lint -- --fix
```

- If there's a version mismatch with node, run nvm install (version type)
  Then run
  ...
  yarn install
  yarn prisma generate
  yarn run dev
  ...
