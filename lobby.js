const socket = io();

socket.on("updateOnlineUsers", (data) => {
    document.getElementById("players").innerHTML = `<p>Players: <b>${data}</b></p>`;
})

document.getElementById("journey").addEventListener("click", () => {
    window.open('/journey', '_self');
});
document.getElementById("domination").addEventListener("click", () => {
    window.open('/domination', '_self');
});