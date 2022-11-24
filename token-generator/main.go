package main

import (
	"fmt"

	"github.com/gbrlsnchs/jwt/v3"
)

var hs = jwt.NewHS256([]byte("my_secret"))

type CustomPayload struct {
	jwt.Payload
	Channel string `json:"channel,omitempty"`
}

func main() {
	pl := CustomPayload{
		Payload: jwt.Payload{
			Subject: "12733",
		},
		Channel: "gossip",
	}

	token, err := jwt.Sign(pl, hs)
	if err != nil {
		fmt.Printf("%s", err.Error())
		return
	}

	fmt.Println(string(token))

	pl2 := jwt.Payload{
		Subject: "12733",
	}

	tokenAuth, err := jwt.Sign(pl2, hs)
	if err != nil {
		fmt.Printf("%s", err.Error())
		return
	}

	fmt.Println(string(tokenAuth))
}
