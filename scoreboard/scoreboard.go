package scoreboard

import (
	"database/sql"
	"fmt"
	"log"
	d "game/database"
	"strconv"
)



func AddToScoreboard(db *sql.DB, name, score, time string) {
	if len(name) < 1 || len(score) < 1 || len(time) < 1 {
		log.Println("Invalid data provided to scoreboard")
		return
	}

	log.Println("Attempting to insert into players table:", name, score, time)

	timeInt, err := strconv.Atoi(time)
	if err != nil {
		log.Println("Error converting time to int", err)
		return
	} 

	scoreInt, err := strconv.Atoi(score)
	if err != nil {
		log.Println("Error converting score to int", err)
		return
	} 

	d.InsertUser(db, name, scoreInt, timeInt)
}

func GetTopScores(db *sql.DB) ([]map[string]string, error) {
	query := `SELECT username, score, time FROM players ORDER BY score DESC LIMIT 10`
	rows, err := db.Query(query)
	if err != nil {
		log.Println("Error retrieving scores:", err)
		return nil, err
	}
	defer rows.Close()

	var scores []map[string]string

	for rows.Next() {
		var username string
		var score int
		var time int
		if err := rows.Scan(&username, &score, &time); err != nil {
			log.Println("Error scanning row:", err)
			return nil, err
		}
		scores = append(scores, map[string]string{
			"username": username,
			"score":    fmt.Sprintf("%d", score),
			"time":     fmt.Sprintf("%d", time),
		})
	}
	return scores, nil
}

