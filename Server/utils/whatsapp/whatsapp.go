package whatsapp

import (
	"fmt"
	"io"
	"net/http"
	"os"
	"strconv"
	"strings"
)

const url = "https://graph.facebook.com/v19.0/328629233675098/messages"

func SendTemplateMessage(phone int) {
	fmt.Println("Sending template message to", phone)
	token := os.Getenv("WA_TOKEN")
	phn := strconv.Itoa(phone) // Convert the integer phone number to a string
	method := "POST"

	payload := strings.NewReader(fmt.Sprintf(`{
	  "messaging_product": "whatsapp",
	  "to": "%s",
	  "type": "template",
	  "template": {
		"name": "hello_world",
		"language": {
		  "code": "en_US"
		}
	  }
	}`, phn))
	

	client := &http.Client{}
	req, err := http.NewRequest(method, url, payload)
	if err != nil {
		fmt.Println("Error creating request:", err)
		return
	}
	
	req.Header.Add("Content-Type", "application/json")
	req.Header.Add("Authorization", fmt.Sprintf("Bearer %s", token)) // Replace with actual token
	res, err := client.Do(req)

	if err != nil {
		fmt.Println("Error sending request:", err)
		return
	}
	defer res.Body.Close()

	body, err := io.ReadAll(res.Body)
	if err != nil {
		fmt.Println("Error reading response:", err)
		return
	}

	fmt.Println("Response:", string(body))
}
