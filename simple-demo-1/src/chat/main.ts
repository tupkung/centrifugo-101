import { initialChat } from "./chat_public_socket";


const chatbox = document.querySelector<HTMLTextAreaElement>("#chatbox");
const sendBtn = document.querySelector<HTMLFormElement>("#messageform");
const username = document.querySelector<HTMLInputElement>("#username");
const messagebox = document.querySelector<HTMLInputElement>("#messagebox");

initialChat(chatbox!, sendBtn!, messagebox!, username!);
