
import { subscribeChannel } from './counter_socket';

const app = document.querySelector<HTMLDivElement>('#app');

const counterDiv = document.createElement("div");
counterDiv.id = "counter";
counterDiv.innerHTML = "counter is 0";

app!.append(counterDiv);

subscribeChannel(counterDiv);
