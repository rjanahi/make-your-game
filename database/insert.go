package database

import (
	"database/sql"

	_ "modernc.org/sqlite"
)

func InsertUser(db *sql.DB, username string, score, time int) (int64, error) {
	query := `INSERT INTO players (username, score, time) VALUES (?, ?, ?)`
	result, err := db.Exec(query, username, score, time)
	if err != nil {
		return 0, err
	}
	lastID, err := result.LastInsertId()
	return lastID, err
}
