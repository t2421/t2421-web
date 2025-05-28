import { Header } from "@t2421/ui/header";
import "./style.css";
import { Counter } from "@t2421/ui/counter";
import { setupCounter } from "@t2421/ui/setup-counter";
import typescriptLogo from "/typescript.svg";

const appElement = document.querySelector<HTMLDivElement>("#app");
if (appElement) {
	appElement.innerHTML = `
    <div>
      <a href="https://vitejs.dev" target="_blank">
        <img src="/vite.svg" class="logo" alt="Vite logo" />
      </a>
      <a href="https://www.typescriptlang.org/" target="_blank">
        <img src="${typescriptLogo}" class="logo vanilla" alt="TypeScript logo" />
      </a>
      ${Header({ title: "Web" })}
      <div class="card">
        ${Counter()}
      </div>
    </div>
  `;
}

const counterElement = document.querySelector<HTMLButtonElement>("#counter");
if (counterElement) {
	setupCounter(counterElement);
}
