(async function () {
  const statusEl = document.getElementById('header-status');
  statusEl.textContent = '加载数据中...';

  let allData, currentScenario, currentScenarioKey;

  try {
    allData = await DataLoader.loadAll();
    currentScenarioKey = 'scenario_20yr';
    currentScenario = await DataLoader.loadScenario(currentScenarioKey);
  } catch (e) {
    statusEl.textContent = '数据加载失败';
    console.error(e);
    return;
  }

  MapManager.init();
  MapManager.addBuildings(allData.buildings);
  MapManager.addFacilities(allData.facilities);
  MapManager.addRoads(allData.roads);
  MapManager.addDrainageNetwork(allData.nodes, allData.pipes);
  MapManager.addPhotoMarkers();
  MapManager.addHeatmap(allData.heatmap);
  MapManager.toggleLayer('heatmap', true);
  MapManager.addTweets(allData.tweets);
  MapManager.setScenarioData(currentScenario);
  MapManager.setRainfallData(allData.rainfall);

  Charts.initRadar(allData.resilience);
  Charts.initLine(currentScenario, allData.rainfall);

  renderTweets(allData.tweets);

  function onTimeUpdate(time, depths, rain) {
    const markerDepths = MapManager.updateDisplay(time);
    const combinedDepths = { ...depths };
    
    Object.keys(CONFIG.LOCATION_MAPPING).forEach((key, index) => {
      const name = CONFIG.LOCATION_MAPPING[key].name;
      if (markerDepths[key] !== undefined) {
        combinedDepths[name] = markerDepths[key] / 100;
      }
    });
    
    renderDepthTable(combinedDepths);
    Decision.render(Decision.evaluate(combinedDepths, currentScenarioKey));
  }

  Timeline.init(onTimeUpdate);
  Timeline.setRainfall(allData.rainfall);
  Timeline.setScenario(currentScenario);

  onTimeUpdate(0, Timeline.getDepthsAtTime(0), 0);

  document.getElementById('scenario-select').addEventListener('change', async (e) => {
    currentScenarioKey = e.target.value;
    statusEl.textContent = '切换情景...';
    try {
      currentScenario = await DataLoader.loadScenario(currentScenarioKey);
      MapManager.setScenarioData(currentScenario);
      Timeline.setScenario(currentScenario);
      Charts.updateLineScenario(currentScenario);
      const depths = Timeline.getDepthsAtTime(Timeline.currentTime);
      const markerDepths = MapManager.updateDisplay(Timeline.currentTime);
      
      const combinedDepths = { ...depths };
      Object.keys(CONFIG.LOCATION_MAPPING).forEach((key, index) => {
        const name = CONFIG.LOCATION_MAPPING[key].name;
        if (markerDepths[key] !== undefined) {
          combinedDepths[name] = markerDepths[key] / 100;
        }
      });
      
      renderDepthTable(combinedDepths);
      Decision.render(Decision.evaluate(combinedDepths, currentScenarioKey));
      statusEl.textContent = currentScenario.scenario || currentScenario.intervention || '就绪';
    } catch (err) {
      statusEl.textContent = '切换失败';
      console.error(err);
    }
  });

  document.getElementById('toggle-heatmap').addEventListener('change', (e) => {
    MapManager.toggleLayer('heatmap', e.target.checked);
  });
  document.getElementById('toggle-pipes').addEventListener('change', (e) => {
    MapManager.toggleLayer('pipes', e.target.checked);
  });
  document.getElementById('toggle-roads').addEventListener('change', (e) => {
    MapManager.toggleLayer('roads', e.target.checked);
  });
  document.getElementById('toggle-tweets').addEventListener('change', (e) => {
    MapManager.toggleLayer('tweets', e.target.checked);
  });

  window.addEventListener('resize', () => Charts.resize());

  statusEl.textContent = '20年一遇暴雨';

  function renderDepthTable(depths) {
    const container = document.getElementById('depth-table');
    container.innerHTML = Object.entries(depths).map(([name, depth]) => {
      const cm = (depth * 100).toFixed(1);
      const pct = Math.min(depth / 0.6 * 100, 100);
      const style = getDepthStyle(depth);
      return `
        <div class="depth-row">
          <span class="depth-name">${name}</span>
          <div class="depth-bar-bg">
            <div class="depth-bar" style="width:${pct}%;background:${style.color}"></div>
          </div>
          <span class="depth-value" style="color:${style.color}">${cm} cm</span>
        </div>`;
    }).join('');
  }

  function getDepthStyle(depth) {
    for (const t of CONFIG.DEPTH_THRESHOLDS) {
      if (depth >= t.min) return t;
    }
    return { color: '#445566', label: '无积水' };
  }

  function renderTweets(tweets) {
    const container = document.getElementById('tweet-list');
    container.innerHTML = tweets.map(t => `
      <div class="tweet-item">
        <div class="tweet-content">${t.text}</div>
        <div class="tweet-meta">${t.time}</div>
      </div>
    `).join('');
  }
})();
