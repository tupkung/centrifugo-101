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

const sub = centrifuge.newSubscription("gossip:color", {
    token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjaGFubmVsIjoiZ29zc2lwOmNvbG9yIiwic3ViIjoidXNlcjAwMSJ9.anPhMaCxz7fbBXZuLmkKN5dL_0UT_IzIKBsH9HY9-Po"
});




export function initialColorDot(canvas: HTMLCanvasElement) {
    sub.on('publication', function(ctx) {
        drawCircle(ctx.data.x, ctx.data.y, ctx.data.color, ctx.data.rd);
    }).on('subscribing', function(ctx) {
        console.log(`subscribing: ${ctx.code}, ${ctx.reason}`);
    }).on('subscribed', function(ctx) {
        console.log(`subscribed`, ctx);
    }).on('unsubscribed', function(ctx) {
        console.log(`unsubscribed: ${ctx.code}, ${ctx.reason}`)
    }).subscribe();

    const randomIntFromInterval = (min: number, max: number) => { // min and max included 
        return Math.floor(Math.random() * (max - min + 1) + min)
      }

    const random_rgba = () => {
        var o = Math.round, r = Math.random, s = 255;
        return 'rgba(' + o(r()*s) + ',' + o(r()*s) + ',' + o(r()*s) + ',' + r().toFixed(1) + ')';
    }

    const drawCircle = (x: number, y: number, color: string, rd: number) => {
        let ctx = canvas.getContext("2d");

        ctx?.beginPath();
        
        ctx?.arc(x, y, rd, 0, 2 * Math.PI);
        
        ctx!.fillStyle = color;
        ctx!.strokeStyle = color;
        ctx?.fill();
        ctx?.stroke();
    }

    canvas?.addEventListener("click", (ev: MouseEvent) => {
        ev.preventDefault();
        const x = ev.clientX;
        const y = ev.clientY;
        const color = random_rgba();
        const rd = randomIntFromInterval(5, 40);
        sub.publish({
            x,
            y,
            color,
            rd
        });


    });


    
}