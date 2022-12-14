import { Centrifuge } from "centrifuge";

var counter = 0;

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

const sub = centrifuge.newSubscription("gossip:counter", {
    token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjaGFubmVsIjoiZ29zc2lwOmNvdW50ZXIiLCJzdWIiOiJ1c2VyMDAxIn0.K3xQpJfKpyuiJrR5A3vXZM6wGPNhel2hyVMzhI7KMnc"
});

export function subscribeChannel(element: HTMLDivElement, countbtn: HTMLButtonElement) {
    sub.on('publication', function(ctx) {
        element.innerHTML = `counter is ${ctx.data.value}`;
        document.title = ctx.data.value;
        counter = ctx.data.value;
    }).on('subscribing', function(ctx) {
        console.log(`subscribing: ${ctx.code}, ${ctx.reason}`);
    }).on('subscribed', function(ctx) {
        console.log(`subscribed`, ctx);
    }).on('unsubscribed', function(ctx) {
        console.log(`unsubscribed: ${ctx.code}, ${ctx.reason}`)
    }).subscribe();

    countbtn.addEventListener("click", (ev: MouseEvent) => {
        ev.preventDefault();
        sub.publish({
            "value": counter + 1
        });
    });

}
