


```d2

client: {
    body
    decoder
    encoder
    router
}

server : {
    decoder
    router
    function : {
        decoder
        exec
        encoder
    }

}


client.body -> \
    client.encoder -> server.decoder -> server.router -> server.function.decoder -> server.function.exec -> server.function.encoder -> client.decoder -> client.router




```