# proj-tfl

Project TFL - Thursday Football League

The goal of this project is to supply a web application to allow football teams to be created.

## Apps

There is an old (legacy) Firebase based web application, allowing an organizer to create teams.

A parallel web application with a different tech stack and fully self hosted shall be developed.

## Old app

Tech stack

- The old implementation can be found in the `team-balancer` directory.
- It uses `Angular` for the front-end, `Firebase` for the Data layer and permission settings.
- The web app is deployed on Firebase hosting.

Features

- Authentication via Google account
- Manage a list of players with ratings
- Organize game events (planning)
- Add players to game events.
- Transfer data from planned events (if game is to be held) to a draft
- Balance players in two relatively balanced teams, relative to ratings
- Store post-match data (result, whether it was balanced), update player ratings

## New app

Tech stack

- .NET 10 for the back-end
- Angular for the front-end
  - some pieces of the existing app could be reused.
- SQLite
- Own hosting using a personal domain, on a Linux computer.

Features

- Authentication via Google account
- Manage a list of players with ratings
- Organize game events (planning)
- Add players to game events.
- Transfer data from planned events (if game is to be held) to a draft
- Balance players in two relatively balanced teams, relative to ratings
- Store post-match data (result, whether it was balanced), update player ratings
- Send mail to list of players
- Allow players to register (become users) and join game event from app
- Send browser notifications to users when a new game event can be joined, or key data changed (players joined/left).
