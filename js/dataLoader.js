window.DataLoader = {
  async loadJSON(path) {
    const res = await fetch(path);
    if (!res.ok) throw new Error(`Failed to load ${path}: ${res.status}`);
    return res.json();
  },

  async loadCSV(path) {
    const res = await fetch(path);
    if (!res.ok) throw new Error(`Failed to load ${path}: ${res.status}`);
    const text = await res.text();
    const lines = text.trim().split('\n');
    const headers = lines[0].split(',').map(h => h.trim());
    return lines.slice(1).map(line => {
      const vals = line.split(',');
      const obj = {};
      headers.forEach((h, i) => {
        const v = (vals[i] || '').trim();
        obj[h] = isNaN(v) || v === '' ? v : parseFloat(v);
      });
      return obj;
    });
  },

  async loadAll() {
    const [buildings, roads, facilities, nodes, pipes, pump,
           resilience, heatmap, tweets, rainfall, sensors] = await Promise.all([
      this.loadJSON('generated_data/buildings.json'),
      this.loadJSON('generated_data/roads.json'),
      this.loadJSON('generated_data/facilities.json'),
      this.loadJSON('generated_data/nodes.json'),
      this.loadJSON('generated_data/pipes.json'),
      this.loadJSON('generated_data/pump.json'),
      this.loadJSON('generated_data/resilience.json'),
      this.loadJSON('generated_data/risk_heatmap.json'),
      this.loadJSON('generated_data/tweets.json'),
      this.loadCSV('generated_data/rainfall_20yr.csv'),
      this.loadCSV('generated_data/iot_sensors.csv')
    ]);
    return { buildings, roads, facilities, nodes, pipes, pump,
             resilience, heatmap, tweets, rainfall, sensors };
  },

  async loadScenario(key) {
    const path = CONFIG.SCENARIO_FILES[key];
    if (!path) throw new Error(`Unknown scenario: ${key}`);
    return this.loadJSON(path);
  }
};
