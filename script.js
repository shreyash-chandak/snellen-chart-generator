const sizeRatios = [10.0, 5.0, 3.5, 2.5, 2.0, 1.5, 1.25, 1.0, 0.75, 0.5, 0.4];
const baseSizeMM = 8; // 8mm height for 20/20 line (approx standard at 6m)

document.getElementById("generateBtn").addEventListener("click", () => {
  const container = document.getElementById("chartContainer");
  container.innerHTML = "";
  const rows = document.getElementById("inputRows").value.trim().split("\n");
  if (!rows.length) return;

  rows.forEach((text, i) => {
    const line = document.createElement("div");
    line.className = "snellen-line";
    const fontSize = baseSizeMM * (sizeRatios[i] || 1);
    line.style.fontSize = `${fontSize}mm`;
    line.textContent = text.trim().toUpperCase();
    container.appendChild(line);
  });

  document.getElementById("printBtn").style.display = "inline-block";
});

document.getElementById("printBtn").addEventListener("click", () => {
  window.print();
});
