package database

import (
	"database/sql"
	"fmt"
	"log"

	_ "modernc.org/sqlite"
)

// ConnectToDatabase opens the SQLite database connection.
var dbInstance *sql.DB // Global database instance

func ConnectToDatabase() *sql.DB {
    if dbInstance != nil {
        return dbInstance // ✅ Reuse the existing database connection
    }

    db, err := sql.Open("sqlite", "./game.db")
    if err != nil {
        log.Fatal(err)
    }

    fmt.Println("Successfully connected to the database")

    err = CreateTables(db) // ✅ This only runs ONCE, at startup
    if err != nil {
        log.Fatal("Failed to create tables:", err)
    }

    dbInstance = db
    return db
}



// CreateTables ensures the necessary tables exist.
func CreateTables(db *sql.DB) error {
	tableQueries := []string{
		`CREATE TABLE IF NOT EXISTS players (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			username TEXT NOT NULL,
			score INTEGER NOT NULL,
			time INTEGER NOT NULL
		);`,
	}

	for _, query := range tableQueries {
		_, err := db.Exec(query)
		if err != nil {
			log.Println("Error creating table:", err)
			return err
		}
	}
	log.Println("All tables verified/created successfully")
	return nil
}
