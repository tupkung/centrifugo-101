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

const sub = centrifuge.newSubscription("gossip:stat", {
    token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjaGFubmVsIjoiZ29zc2lwOnN0YXQiLCJzdWIiOiJ1c2VyMDAxIn0.z_gzDMOpwgCzt6f5lc3mYsgM4tgMvTElCai6oJgyR1U"
});

export function initialStat(statbox: HTMLDivElement) {
    sub.on('publication', function(ctx) {
        statbox.innerHTML = `
            <p>CPU Statistics</p>
            <div>cpu user : ${ctx.data.cpu_user} %</div>
            <div>cpu system : ${ctx.data.cpu_system} %</div>
            <div>cpu idle : ${ctx.data.cpu_idle} %</div>
            <p>Memory Statistics</p>
            <div>memory total : ${ctx.data.memory_total} bytes</div>
            <div>memory used : ${ctx.data.memory_used} bytes</div>
            <div>memory cached : ${ctx.data.memory_cached} bytes</div>
            <div>memory free : ${ctx.data.memory_free} bytes</div>
        `;
    }).on('subscribing', function(ctx) {
        console.log(`subscribing: ${ctx.code}, ${ctx.reason}`);
    }).on('subscribed', function(ctx) {
        console.log(`subscribed`, ctx);
    }).on('unsubscribed', function(ctx) {
        console.log(`unsubscribed: ${ctx.code}, ${ctx.reason}`)
    }).subscribe();
}