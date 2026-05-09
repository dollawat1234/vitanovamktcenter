export function exportJSON(brands) {
  const blob = new Blob([JSON.stringify(brands, null, 2)], {
    type: "application/json"
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "vitanova-brands.json";
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
