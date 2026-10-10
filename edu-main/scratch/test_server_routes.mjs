import http from "node:http";

const routes = ["/", "/learning-arena", "/progress", "/study-planner", "/quiz"];

async function checkRoute(route) {
  return new Promise((resolve, reject) => {
    http.get(`http://localhost:5173${route}`, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        resolve({ statusCode: res.statusCode, length: data.length, hasHtml: data.includes("<div id=\"root\"></div>") });
      });
    }).on("error", (err) => reject(err));
  });
}

async function run() {
  console.log("=== VERIFYING HTTP ROUTES ON DEV SERVER ===");
  for (const route of routes) {
    try {
      const res = await checkRoute(route);
      console.log(`Route ${route.padEnd(16)} -> Status: ${res.statusCode}, Has Root: ${res.hasHtml}`);
    } catch (err) {
      console.error(`Route ${route} failed:`, err.message);
    }
  }
}

run();
