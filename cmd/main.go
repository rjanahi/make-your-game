package main

import (
	"database/sql"
	"encoding/json"
	"html/template"
	"log"
	"net/http"

	"game/database"
	e "game/error"
	s "game/scoreboard"
)

type GameOverData struct {
	Name  string `json:"name"`
	Time  string `json:"time"`
	Score string `json:"score"`
}

func main() {
	db := database.ConnectToDatabase()
	defer db.Close() // Ensure the database connection is closed when main exits

	ConnectWeb(db)
	err := database.CreateTables(db)
	if err != nil {
		log.Fatal(err) // Log fatal errors
	}
}

func ConnectWeb(db *sql.DB) {
	http.HandleFunc("/", handleRequest)
	http.HandleFunc("/game", func(w http.ResponseWriter, r *http.Request) {
		handleGame(w, r, db) // Pass the db connection
	})

	// Static files for serving HTML/CSS/JS
	http.Handle("/CSS/", http.StripPrefix("/CSS/", http.FileServer(http.Dir("../CSS/"))))
	http.Handle("/IMG/", http.StripPrefix("/IMG/", http.FileServer(http.Dir("../IMG/"))))
	http.Handle("/JS/", http.StripPrefix("/JS/", http.FileServer(http.Dir("../JS/"))))
	http.Handle("/templates/", http.StripPrefix("/templates/", http.FileServer(http.Dir("../templates/"))))
	http.Handle("/errorPages/", http.StripPrefix("/errorPages/", http.FileServer(http.Dir("../templates/errorPages/"))))

	// Start the server
	log.Println("Server starting on port 8080...")
	log.Println("go to --> http://localhost:8080/")
	log.Fatal(http.ListenAndServe(":8080", nil))

	http.HandleFunc("/scoreboard", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")

		scores, err := s.GetTopScores(db)
		if err != nil {
			e.HandleInternalError(w, r)
			return
		}

		// Send JSON response to JavaScript
		json.NewEncoder(w).Encode(scores)
	})
}

func handleRequest(w http.ResponseWriter, r *http.Request) {
	if r.URL.Path != "/" && r.URL.Path != "/game" && r.URL.Path != "/scoreboard" {
		// Send custom error page for unmatched routes
		e.HandleNotFound(w,r)
		return
	}
	
	tmpl, err := template.ParseFiles("../templates/index.html")
	if err != nil {
		e.HandleInternalError(w, r)
		return
	}
	if err := tmpl.Execute(w, nil); err != nil {
		e.HandleInternalError(w, r)
	}
}

func handleGame(w http.ResponseWriter, r *http.Request, db *sql.DB) {
	if r.Method == http.MethodGet {
		w.Header().Set("Content-Type", "text/html; charset=UTF-8")

		//  Fetch the top 10 scores before rendering game.html
		scores, err := s.GetTopScores(db)
		if err != nil {
			e.HandleInternalError(w, r)
			return
		}

		tmpl, err := template.ParseFiles("../templates/game.html") // Ensure correct path
		if err != nil {
			e.HandleInternalError(w, r)
			return
		}

		//  Pass scoreboard data to game.html
		if err := tmpl.Execute(w, scores); err != nil {
			e.HandleInternalError(w, r)
		}
		return
	}

	if r.Method == http.MethodPost {
		var data GameOverData
		err := json.NewDecoder(r.Body).Decode(&data)
		if err != nil {
			e.HandleBadRequest(w,r)
			return
		}

		//  Insert player score into the database
		s.AddToScoreboard(db, data.Name, data.Score, data.Time)

		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode(data)
	}
}
