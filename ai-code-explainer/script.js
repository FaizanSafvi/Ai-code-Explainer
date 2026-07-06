async function explainCode() {
  const code = document.getElementById("codeInput").value;
  const output = document.getElementById("output");

  if (!code.trim()) {
    output.innerText = "Please paste some JavaScript code first.";
    return;
  }

  output.innerText = "Analyzing your code... 🤖";

  try {
    const response = await fetch("http://localhost:3000/explain", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "The server could not explain the code.");
    }

    renderExplanation(data.explanation, output);
  } catch (error) {
    console.error(error);
    output.innerText = `Error: ${error.message}`;
  }
}

function renderExplanation(text, output) {
  output.innerHTML = "";
  let codeBlock = null;

  for (const rawLine of text.split("\n")) {
    const line = rawLine.trim();

    if (line.startsWith("```")) {
      if (codeBlock) {
        output.appendChild(codeBlock);
        codeBlock = null;
      } else {
        codeBlock = document.createElement("pre");
      }
      continue;
    }

    if (codeBlock) {
      codeBlock.textContent += `${rawLine}\n`;
      continue;
    }

    if (!line) continue;

    if (/^-{3,}$/.test(line)) {
      output.appendChild(document.createElement("hr"));
      continue;
    }

    const headingMatch = line.match(/^#{1,6}\s+(.+)$/);
    const plainHeading = /^(OVERVIEW|HOW IT WORKS|RESULT|KEY POINT)$/i.test(line);

    if (headingMatch || plainHeading) {
      const heading = document.createElement("h3");
      heading.textContent = cleanFormatting(headingMatch?.[1] || line);
      output.appendChild(heading);
      continue;
    }

    const bulletMatch = line.match(/^(?:\*|-|•)\s+(.+)$/);
    if (bulletMatch) {
      const point = document.createElement("div");
      point.className = "explanation-point";
      point.textContent = `• ${cleanFormatting(bulletMatch[1])}`;
      output.appendChild(point);
      continue;
    }

    const paragraph = document.createElement("p");
    paragraph.textContent = cleanFormatting(line);
    output.appendChild(paragraph);
  }

  if (codeBlock) output.appendChild(codeBlock);
}

function cleanFormatting(text) {
  return text.replace(/\*\*/g, "").replace(/`/g, "");
}
