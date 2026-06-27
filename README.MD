# Make Your Game

A web-based implementation of **Tetris** built with Go, JavaScript, HTML, and CSS. The game runs entirely in the browser while a Go backend serves the application and stores player scores in an SQLite database.

## Features

- Classic Tetris gameplay
- Random tetromino generation
- Next-piece preview
- Score tracking
- Timer
- Game over screen
- Persistent leaderboard using SQLite
- Custom HTTP error pages
- Responsive browser interface

## Technologies

- Go
- HTML
- CSS
- JavaScript
- SQLite

## Project Structure

```
.
├── CSS/                    # Styling
├── IMG/                    # Images and logos
├── JS/
│   └── script.js           # Game logic
├── cmd/
│   ├── main.go             # Server entry point
│   └── game.db             # SQLite database
├── database/               # Database setup
├── error/                  # Error handlers
├── scoreboard/             # Leaderboard functionality
├── templates/
│   ├── errorPages/
│   ├── game.html
│   └── index.html
├── go.mod
└── go.sum
```

## Installation

Clone the repository:

```bash
git clone https://github.com/rjanahi/make-your-game.git
cd make-your-game
```

Install dependencies:

```bash
go mod tidy
```

## Running the Game

Start the server:

```bash
go run ./cmd
```

Open your browser and visit:

```
http://localhost:8080
```

## How to Play

The objective is to clear horizontal lines by arranging falling tetrominoes.

As lines are completed:

- Your score increases.
- New blocks continue to fall.
- The game ends when new pieces can no longer enter the board.

## Controls

| Key | Action |
|------|--------|
| ← | Move left |
| → | Move right |
| ↓ | Soft drop |
| ↑ | Rotate piece |
| P | Pause / Resume |

## Leaderboard

Player scores are stored in an SQLite database.

After each game, the player's:

- Name
- Score
- Survival time

are saved and displayed on the leaderboard.

## Error Handling

The server includes custom pages for:

- 400 Bad Request
- 404 Not Found
- 405 Method Not Allowed
- 500 Internal Server Error

## Future Improvements

- Hard drop
- Hold piece mechanic
- Levels and increasing speed
- Sound effects and music
- Mobile support
- Dark/light themes
- Online leaderboard
- Multiplayer mode

## Authors

- Reem Janahi
- Omar Janahi

## License

This project was developed for educational purposes as part of the Reboot01 curriculum.
