export async function log(stack, level, pkg, message) {
  const allowedStacks = ["frontend", "backend"];
  const allowedLevels = ["debug", "info", "warn", "error", "fatal"];
  const allowedPackages = [
    "api", "component", "hook", "page", "state", "style", 
    "auth", "config", "middleware", "utils"
  ];

  if (!allowedStacks.includes(stack)) {
    throw new Error(`Invalid stack: ${stack}`);
  }
  if (!allowedLevels.includes(level)) {
    throw new Error(`Invalid level: ${level}`);
  }
  if (!allowedPackages.includes(pkg)) {
    throw new Error(`Invalid package: ${pkg}`);
  }

  const body = { stack, level, package: pkg, message };

  try {
    const response = await fetch("http://20.244.56.144/evaluation-service/logs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const text = await response.text();
      console.error("Log request failed:", text);
    }
  } catch (error) {
    console.error("Error sending log:", error);
  }
}
