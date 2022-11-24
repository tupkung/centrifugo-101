import { Centrifuge } from "centrifuge";

const centrifuge = new Centrifuge('ws://localhost:8000/connection/websocket', {
    token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjczMyJ9._XgTKmb_lGHFDTG1aJVaDjbJFQVavhL1LAKwkCBG2II"
});

centrifuge.on('connecting', function(ctx) {
    console.log(`connecting: ${ctx.code}, ${ctx.reason}`);
}).on('connected', function(ctx) {
    console.log(`connected over ${ctx.transport}`);
}).on('disconnected', function(ctx) {
    console.log(`disconnected: ${ctx.code}, ${ctx.reason}`);
}).connect();

const sub = centrifuge.newSubscription("gossip", {
    token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjczMyIsImNoYW5uZWwiOiJnb3NzaXAifQ.vol1404d3adLNhyr6HwhJs7VsJXYeiHcRCxTXkz3QZU"
});

export function subscribeChannel(element: HTMLDivElement) {
    sub.on('publication', function(ctx) {
        element.innerHTML = `counter is ${ctx.data.value}`;
        document.title = ctx.data.value;
    }).on('subscribing', function(ctx) {
        console.log(`subscribing: ${ctx.code}, ${ctx.reason}`);
    }).on('subscribed', function(ctx) {
        console.log(`subscribed`, ctx);
    }).on('unsubscribed', function(ctx) {
        console.log(`unsubscribed: ${ctx.code}, ${ctx.reason}`)
    }).subscribe();
}
