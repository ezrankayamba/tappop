const express = require("express");
const path = require("path");
const handlebars = require("express-handlebars");
const WebSocket = require("ws");
const http = require("http");
const bodyParser = require("body-parser");

const app = express();
const port = process.env.PORT || "8080";

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
let random = (min, max) => {
    return Math.floor(Math.random() * (max - min) + min);
};
let list = [];
["Juma Kapya", "Amos Tanu", "Hamis Rashid"].forEach((name, id) => {
    list.push({
        id: id,
        name: name,
        age: random(20, 61),
        projects: random(1, 101),
        performance: random(1, 101)
    });
});

wss.on("connection", ws => {
    ws.on("message", message => {
        console.log(`Received message => ${message}`);
        let data = JSON.parse(JSON.parse(message));
        console.log(data);
        if (data.cmd === "broadcast") {
            let dist = null;
            list.forEach((d, id) => {
                if (id === parseInt(data.id)) {
                    dist = d;
                }
            });
            ws.broadcast(JSON.stringify(dist));
            console.log("Broadcast sent");
        } else {
            console.log("Unknown command: ", data.cmd, data);
        }
    });
    // ws.send("ho!");
    ws.broadcast = data => {
        wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify(data));
            }
        });
    };
    wsRef = ws;
});
app.set("view engine", "hbs");

app.engine(
    "hbs",
    handlebars({
        layoutsDir: __dirname + "/views/layouts",
        extname: "hbs",
        partialsDir: ["views/partials/"]
    })
);

app.use(express.json());
// app.use(bodyParser);
app.use(express.static("public"));

app.get("/", (req, res) => {
    res.render("main", { layout: "index" });
});

app.get("/admin", (req, res) => {
    res.render("admin", { layout: "index", distributors: list });
});

server.listen(port, "0.0.0.0", () => {
    console.log(`Listening to requests on http://localhost:${port}`);
});
