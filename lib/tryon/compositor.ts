export function renderMockLook(
  source: HTMLCanvasElement,
  tone: [string, string],
  label: string,
): string {
  const canvas = document.createElement("canvas");
  canvas.width = source.width;
  canvas.height = source.height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return source.toDataURL("image/jpeg", 0.9);

  ctx.drawImage(source, 0, 0);

  const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
  grad.addColorStop(0, `${tone[0]}00`);
  grad.addColorStop(1, `${tone[1]}66`);
  ctx.fillStyle = grad;
  ctx.globalCompositeOperation = "overlay";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.globalCompositeOperation = "source-over";

  const vignette = ctx.createRadialGradient(
    canvas.width / 2,
    canvas.height / 2,
    canvas.height / 3,
    canvas.width / 2,
    canvas.height / 2,
    canvas.height / 1.2,
  );
  vignette.addColorStop(0, "rgba(0,0,0,0)");
  vignette.addColorStop(1, "rgba(0,0,0,0.35)");
  ctx.fillStyle = vignette;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const barHeight = Math.max(48, canvas.height * 0.07);
  ctx.fillStyle = "rgba(10,9,7,0.55)";
  ctx.fillRect(0, canvas.height - barHeight, canvas.width, barHeight);
  ctx.fillStyle = "#f6f3ec";
  ctx.font = `${Math.round(barHeight * 0.34)}px sans-serif`;
  ctx.textBaseline = "middle";
  ctx.fillText(`Drape AI · ${label}`, 20, canvas.height - barHeight / 2);

  return canvas.toDataURL("image/jpeg", 0.92);
}
