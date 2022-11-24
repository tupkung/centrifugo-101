
import { subscribeChannel } from './counter_socket';

const app = document.querySelector<HTMLDivElement>('#app');

const counterDiv = document.createElement("div");
counterDiv.id = "counter";
counterDiv.innerHTML = "counter is 0";

const countBtn = document.createElement("button");
countBtn.id = "countbtn";
countBtn.innerHTML = "Count";

app!.append(counterDiv);
app!.append(countBtn);

subscribeChannel(counterDiv, countBtn);
