# Lab 1: Node.js and Express server

**Name:** Amrruth R Naregal  
**Registration number:** 252U1R9009  
**Section:** CSE Gen AI 2A

## Live link
Not deployed yet. Add your public deployment URL here after deploying.

## Objective
Set up a Node.js project and build a small web server using Express.

## Requirements
- Node.js and npm installed
- A web browser

## How to install and run

```bash
npm install
npm start
```

The server runs at `http://localhost:3000` by default. If the hosting platform provides a `PORT`
environment variable, the server uses that port automatically.

## Endpoints

| Method | Path | Description | Expected status |
|---|---|---|---|
| GET | `/` | Displays a welcome message | 200 |
| GET | `/about` | Returns the student name and section as JSON | 200 |
| GET | `/time` | Returns the current date and time as JSON | 200 |
| GET | Any unknown path | Returns a not-found message | 404 |

## Screenshots
After running the server, open each endpoint in your browser and save screenshots in the
`screenshots/` folder. Then add them below.

- `screenshots/home.png` — GET /
- `screenshots/about.png` — GET /about
- `screenshots/time.png` — GET /time
- `screenshots/not-found.png` — optional 404 test

## package.json fields
- `name`: project/package name.
- `version`: current project version.
- `description`: short explanation of the project.
- `main`: main application file.
- `scripts`: shortcut commands such as `npm start`.
- `keywords`: search terms describing the project.
- `author`: project author.
- `license`: license for the project.
- `dependencies`: packages required by the application, including Express.

## Notes
- `app.listen()` starts the server and makes it listen for requests on the selected port.
- `req` represents the incoming request; `res` is used to send a response.
- `node_modules` is created by `npm install` and is not committed to Git.
- `package.json` records project metadata and dependencies.

## Problems faced and solutions
Add any problems you personally faced and how you solved them.
