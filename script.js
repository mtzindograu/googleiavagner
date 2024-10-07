import { GoogleGenerativeAI } from "@google/generative-ai";
const API_KEY = "AIzaSyDVrd-WKW762hALrX_9f9vm8WcNGJir2SE";
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash", systemInstruction:"Chat, você so pode falar sobre futebol e não responder qunado for de outras coisas"});

const app = document.getElementById("resposta-da-ia");
const promptElement = document.querySelector("textarea");
const enviarButton = document.getElementById("mensagem");

enviarButton.addEventListener("click", async () => {
  const prompt = promptElement.value;
  promptElement.value = "";
  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = await response.text();
  app.innerHTML = text;
  fetch('https://api.ipify.org?format=json')
  .then(response => response.json())
  .then(data => {
    fetch("http://localhost:6969/historico", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ isGPT: false, action: prompt, ip: data.ip }),
    });
  })
  .catch(error => console.error('Erro ao obter o IP:', error));
  fetch("http://localhost:6969/historico", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ isGPT: true, action: text }),
  });
  let ip = fetch("https://api.ipify.org?format=json")
  .then((response) => response.json())
  .then((data) => {
    return data.ip;
  })
  .catch((error) => {
    console.log("Error:", error);
  });
});