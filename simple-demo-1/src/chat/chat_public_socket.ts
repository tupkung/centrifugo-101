import { Centrifuge } from "centrifuge";


const centrifuge = new Centrifuge('wss://socket.superrich.kaileak.com/connection/websocket', {
    token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c2VyMDAxIn0.c1_mzBOchMPIBCXeY1m8cuPKaqhAAhG16eIpGKFKrBM"
});

centrifuge.on('connecting', function(ctx) {
    console.log(`connecting: ${ctx.code}, ${ctx.reason}`);
}).on('connected', function(ctx) {
    console.log(`connected over ${ctx.transport}`);
}).on('disconnected', function(ctx) {
    console.log(`disconnected: ${ctx.code}, ${ctx.reason}`);
}).connect();

const sub = centrifuge.newSubscription("gossip:greeting", {
    token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjaGFubmVsIjoiZ29zc2lwOmdyZWV0aW5nIiwiZXhwIjoxNjY5MjU5Mjc0LCJzdWIiOiJ1c2VyMDAxIn0.stEFyww2Y9Rrjc0TU-Owxk-w4ITAVS2YFaXfk3KvJq4"
});

export function initialChat(chatbox: HTMLTextAreaElement , sendBtn: HTMLFormElement, messagebox: HTMLInputElement, username: HTMLInputElement ) {
    sub.on('publication', function(ctx) {
        chatbox.value = `${chatbox.value} \n ${new Date().toLocaleString('th-TH')} - ${ctx.data.username} : ${ctx.data.value}`;
        chatbox.scrollTop = chatbox.scrollHeight;
    }).on('subscribing', function(ctx) {
        console.log(`subscribing: ${ctx.code}, ${ctx.reason}`);
    }).on('subscribed', function(ctx) {
        console.log(`subscribed`, ctx);
    }).on('unsubscribed', function(ctx) {
        console.log(`unsubscribed: ${ctx.code}, ${ctx.reason}`)
    }).subscribe();

    sendBtn.addEventListener("submit", (ev: SubmitEvent) => {
        ev.preventDefault();
        sub.publish({
                "value": messagebox.value,
                "username": username.value
        }).then(function(){
            messagebox.value = "";
        });
    });
}