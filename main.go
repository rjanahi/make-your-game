package main

import (
	"fmt"
	"html/template"
	"log"
	"net/http"
)

type HomePageData struct {
	Title string
}

func main() {
	http.HandleFunc("/", HandleRequest)
	http.Handle("/css/", http.StripPrefix("/css/", http.FileServer(http.Dir("css/"))))
	http.Handle("/img/", http.StripPrefix("/img/", http.FileServer(http.Dir("img/"))))
	http.Handle("/js/", http.StripPrefix("/js/", http.FileServer(http.Dir("js/"))))
	fmt.Println("go to -->  http://localhost:5500/ ")
	log.Fatal(http.ListenAndServe(":5500", nil))

}

func HandleRequest(w http.ResponseWriter, r *http.Request) {
	if r.URL.Path != "/" {
		http.NotFound(w, r)
		return
	}

	if r.Method == "GET" {
		data := HomePageData{
			Title: "Welcome to the Main Page",
		}

		tmpl, err := template.ParseFiles("index.html") // Update with the correct file path
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		err = tmpl.Execute(w, data)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
	}

}
