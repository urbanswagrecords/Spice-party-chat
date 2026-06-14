const WebSocket = require("ws");

const server = new WebSocket.Server({ port: 3000 });
let parties = {};

server.on("connection", socket => {
    socket.on("message", msg => {
        let data = JSON.parse(msg);

        if (data.type === "create") {
            parties[data.partyId] = [];
            parties[data.partyId].push(socket);
        }

        if (data.type === "join") {
            if (!parties[data.partyId]) parties[data.partyId] = [];
            parties[data.partyId].push(socket);
        }

        if (data.type === "signal") {
            parties[data.partyId].forEach(member => {
                if (member !== socket) {
                    member.send(JSON.stringify({
                        type: "signal",
                        from: data.from,
                        signal: data.signal
                    }));
                }
            });
        }
    });

    socket.on("close", () => {
        for (let id in parties) {
            parties[id] = parties[id].filter(s => s !== socket);
        }
    });
});

console.log("SPICE PARTY CHAT SERVER LIVE on port 3000");
