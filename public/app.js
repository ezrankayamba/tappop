const host = window.location.host;
const prot = window.location.protocol;
const url = (prot === "https" ? "wss" : "ws") + "://" + host;
const connection = new WebSocket(url);
(function() {
    let path = window.location.pathname;
    console.log("App started!", path);
    if (path === "/admin") {
        console.log("Admin page");
        let elements = document.querySelectorAll(".btn-broadcast");
        for (let i = elements.length - 1; i >= 0; i--) {
            let el = elements[i];
            el.addEventListener("click", function(e) {
                let btn = e.target;
                let id = btn.dataset.id;
                let data = JSON.stringify({
                    cmd: "broadcast",
                    id: id
                });
                console.log(data);
                connection.send(JSON.stringify(data));
            });
        }
    } else {
        console.log("Other users");
        connection.onopen = function() {
            console.log("Connected");
        };
        connection.onmessage = function(e) {
            console.log(e.data);
            document.querySelector("#distributor").classList.remove("hide");
            let data = JSON.parse(JSON.parse(e.data));
            console.log(data);
            let setValue = function(cls, value) {
                document.querySelector("." + cls).innerHTML = value;
            };
            setValue("card-title", data.name);
            setValue("card-subtitle", "Aged: " + data.age);
            setValue(
                "card-text",
                "This distributor executed his duties for " +
                    data.projects +
                    " and managed to archieve a performance of " +
                    data.performance +
                    "%"
            );
        };
        connection.onerror = function(error) {
            console.log("WebSocket error: " + error);
        };
    }
})();
