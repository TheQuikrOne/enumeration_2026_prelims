let data = [];

// Load CSV on page load
fetch('results.csv')
  .then(response => response.text())
  .then(text => parseCSV(text))
  .catch(err => {
    document.getElementById('output').innerHTML =
      '<div class="error">Failed to load results data.</div>';
    console.error(err);
  });

function parseCSV(text) {
  const lines = text.trim().split('\n');
  const headers = lines[0].split(',');

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',');
    const row = {};
    headers.forEach((h, j) => row[h] = values[j]);
    data.push(row);
  }
}

function search() {
  const name = document.getElementById('nameInput').value.trim().toLowerCase();
  const output = document.getElementById('output');

  if (!name) {
    output.innerHTML = '<div class="error">Please enter a name.</div>';
    return;
  }

  const matches = data.filter(r =>
    r.Name && r.Name.toLowerCase() === name
  );

  if (matches.length === 0) {
    output.innerHTML = '<div class="error">No result found.</div>';
    return;
  }

  output.innerHTML = matches.map(showResult).join('');
}

function showResult(r) {
  let html = `
    <div class="result">
      <h3>${r.Name}</h3>

      <p><b>Rank:</b> ${r.Rank}</p>
      <p><b>Source:</b> ${r.Source}</p>

      <hr>

      <p><b>Section-wise Raw Scores</b></p>
      <p>Warmup: ${r.WarmupRaw}</p>
      <p>Single Choice Questions (SCQ): ${r.SCQRaw}</p>
      <p>Multiple Choice Questions (MCQ): ${r.MCQRaw}</p>
      <p>Integer Questions: ${r.IntRaw}</p>

      <hr>

      <p><b>Total Marks:</b> ${r.TotalScore}</p>
  `;

  if (r.Proctoring && r.Proctoring.toLowerCase() !== 'clear') {
    html += `
      <div class="warning">
        ⚠️ Proctoring status: ${r.Proctoring}
      </div>
    `;
  }

  html += `</div>`;
  return html;
}

