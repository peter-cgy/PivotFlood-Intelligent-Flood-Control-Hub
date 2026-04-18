window.MapManager = {
  map: null,
  markers: {},
  layers: {
    heatmap: null,
    tweets: null
  },
  scenarioData: null,
  rainfallData: [],
  tweetsData: [],
  riskHeatmapData: null,

  getColor(depthCm) {
    if (depthCm > 40) return '#ff2d2d';
    if (depthCm >= 27) return '#ff8c00';
    if (depthCm >= 15) return '#ffd700';
    return '#00bfff';
  },

  getRiskColor(risk) {
    switch (risk) {
      case 'red': return '#ff2d2d';
      case 'orange': return '#ff8c00';
      case 'yellow': return '#ffd700';
      default: return '#00bfff';
    }
  },

  init() {
    this.map = L.map('map', {
      center: CONFIG.MAP_CENTER,
      zoom: CONFIG.MAP_ZOOM,
      zoomControl: false,
      attributionControl: false
    });

    L.control.zoom({ position: 'topright' }).addTo(this.map);

    L.tileLayer('https://webst0{s}.is.autonavi.com/appmaptile?style=7&x={x}&y={y}&z={z}', {
      subdomains: ['1', '2', '3', '4'],
      minZoom: 3,
      maxZoom: 18,
      attribution: '&copy; 高德地图'
    }).addTo(this.map);
    // L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    //   attribution: '&copy; OpenStreetMap contributors'
    // }).addTo(this.map);
    // L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    //   maxZoom: 19,
    //   subdomains: 'abcd'
    // }).addTo(this.map);

    Object.keys(CONFIG.LOCATION_MAPPING).forEach(key => {
      const info = CONFIG.LOCATION_MAPPING[key];
      const marker = L.circleMarker([info.lat, info.lng], {
        radius: 7,
        fillColor: '#1565c0',
        color: '#fff',
        weight: 2,
        opacity: 1,
        fillOpacity: 0.9
      }).addTo(this.map);
      marker.bindPopup(`<b>${info.name}</b><br>积水深度: --`, {
        className: 'custom-popup'
      });
      this.markers[key] = marker;
    });

    this.addCameraMarker();
    this.addTwitterMarker();
  },

  addCameraMarker() {
    const cameraIcon = L.divIcon({
      className: 'custom-icon',
      html: '<div class="cam-icon"><svg viewBox="0 0 24 24" width="20" height="20"><rect x="3" y="7" width="18" height="13" rx="2" fill="none" stroke="#1565c0" stroke-width="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" fill="none" stroke="#1565c0" stroke-width="2"/><circle cx="12" cy="13" r="3" fill="none" stroke="#1565c0" stroke-width="2"/></svg></div>',
      iconSize: [24, 24],
      iconAnchor: [12, 24]
    });

    const cameraMarker = L.marker([31.032, 121.453], { icon: cameraIcon }).addTo(this.map);
    cameraMarker.bindPopup(`
        <div style="text-align: center;">
            <div style="font-weight: bold; margin-bottom: 10px; color: #00d4ff;">📹 监控摄像头</div>
            <img src="https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=flooded%20campus%20street%20with%20rain%20and%20water%20logging&image_size=square_hd" 
                 style="width: 200px; height: auto; border-radius: 8px;">
        </div>
    `, {
      className: 'custom-popup',
      maxWidth: 250
    });
  },

  addTwitterMarker() {
    const twitterIcon = L.divIcon({
      className: 'custom-icon',
      html: '<div style="font-size: 28px; text-shadow: 2px 2px 4px rgba(0,0,0,0.5);">💬</div>',
      iconSize: [32, 32],
      iconAnchor: [16, 32]
    });

    const twitterMarker = L.marker([31.0305, 121.454], { icon: twitterIcon }).addTo(this.map);
    twitterMarker.bindPopup('', {
      className: 'custom-popup',
      maxWidth: 300
    });

    twitterMarker.on('click', () => {
      if (this.tweetsData && this.tweetsData.length > 0) {
        const tweetsHtml = this.tweetsData.map(tweet => `
                <div style="margin-bottom: 12px; padding: 10px; background: rgba(0, 212, 255, 0.1); border-radius: 6px; border-left: 3px solid #00d4ff;">
                    <div style="color: #fff; font-size: 13px; line-height: 1.5;">${tweet.text}</div>
                    <div style="color: #888; font-size: 11px; margin-top: 5px;">🕐 ${tweet.time}</div>
                </div>
            `).join('');

        twitterMarker.setPopupContent(`
                <div>
                    <div style="font-weight: bold; margin-bottom: 12px; color: #00ff88; font-size: 14px;">📢 实时舆情</div>
                    ${tweetsHtml}
                </div>
            `);
      }
    });
  },

  addBuildings(buildings) {
    const group = L.layerGroup();
    buildings.forEach(b => {
      const icon = L.divIcon({
        className: 'building-marker',
        html: `<div class="marker-dot"></div><div class="marker-label">${b.name}</div>`,
        iconSize: [12, 12],
        iconAnchor: [6, 6]
      });
      L.marker([b.lat, b.lng], { icon }).addTo(group);
    });
    group.addTo(this.map);
  },

  addFacilities(facilities) {
    const iconMap = { hospital: '🏥', subway: '🚇', power: '⚡' };
    const group = L.layerGroup();
    facilities.forEach(f => {
      const emoji = iconMap[f.type] || '📍';
      const icon = L.divIcon({
        className: 'facility-marker',
        html: `<span class="facility-icon">${emoji}</span><span class="facility-label">${f.name}</span>`,
        iconSize: [20, 20],
        iconAnchor: [10, 10]
      });
      L.marker([f.lat, f.lng], { icon }).addTo(group);
    });
    group.addTo(this.map);
  },

  addRoads() {
  },

  addDrainageNetwork(nodes, pipes) {
    const group = L.layerGroup();
    const nodeMap = {};
    nodes.forEach(n => {
      nodeMap[n.id] = n;
      const isOutfall = n.type === 'outfall';
      L.circleMarker([n.lat, n.lng], {
        radius: isOutfall ? 7 : 5,
        color: isOutfall ? '#00b894' : '#00d4ff',
        fillColor: isOutfall ? '#00b894' : '#00d4ff',
        fillOpacity: isOutfall ? 0.8 : 0.6,
        weight: isOutfall ? 2 : 1
      }).bindTooltip(
        isOutfall ? `${n.id} 排水口 → 樱桃河` : `${n.id} (高程: ${n.elevation}m)`,
        { className: 'pipe-tooltip' }
      ).addTo(group);
    });

    pipes.forEach(p => {
      const from = nodeMap[p.from];
      const to = nodeMap[p.to];
      if (from && to) {
        L.polyline([[from.lat, from.lng], [to.lat, to.lng]], {
          color: '#00d4ff',
          weight: 2,
          opacity: 0.5,
          dashArray: '6, 4'
        }).bindTooltip(`管径: ${p.diameter}m / 长度: ${p.length}m`, { className: 'pipe-tooltip' })
          .addTo(group);
      }
    });
    group.addTo(this.map);
    this.layers.pipes = group;
  },

  addRiskHeatmap() {
    if (!this.riskHeatmapData || !this.riskHeatmapData.features) return;

    this.layers.heatmap = L.layerGroup();
    this.riskHeatmapData.features.forEach(feature => {
      const [lng, lat] = feature.geometry.coordinates;
      const radius = feature.properties.radius || 100;
      const riskColor = this.getRiskColor(feature.properties.risk);

      L.circle([lat, lng], {
        radius: radius,
        fillColor: riskColor,
        color: riskColor,
        weight: 1.5,
        opacity: 0.6,
        fillOpacity: 0.2
      }).addTo(this.layers.heatmap).bindPopup(`
            <div style="color: #fff;">
                <div style="font-weight: bold; margin-bottom: 5px;">风险区域</div>
                <div>等级: ${feature.properties.risk}</div>
                <div>深度: ${feature.properties.depth}</div>
            </div>
        `, { className: 'custom-popup' });
    });
  },

  addPhotoMarkers() {
    const photos = [
      { lat: 31.033, lng: 121.455, src: 'real-data/flood_photos/ecnu_flood1.jpg', caption: '校园积水现场 - 排水口疏通' },
      { lat: 31.030, lng: 121.448, src: 'real-data/flood_photos/ecnu_flood2.jpg', caption: '校园积水现场 - 路面积水' }
    ];
    const group = L.layerGroup();
    photos.forEach(p => {
      const icon = L.divIcon({
        className: 'photo-marker',
        html: '<div class="cam-icon"><svg viewBox="0 0 24 24" width="18" height="18"><rect x="3" y="7" width="18" height="13" rx="2" fill="none" stroke="#1565c0" stroke-width="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" fill="none" stroke="#1565c0" stroke-width="2"/><circle cx="12" cy="13" r="3" fill="none" stroke="#1565c0" stroke-width="2"/></svg></div>',
        iconSize: [20, 20],
        iconAnchor: [10, 10]
      });
      L.marker([p.lat, p.lng], { icon })
        .bindPopup(
          `<div class="photo-popup">
            <img src="${p.src}" alt="${p.caption}" style="width:240px;border-radius:6px;">
            <div class="photo-caption">${p.caption}</div>
          </div>`,
          { className: 'photo-popup-wrapper', maxWidth: 280 }
        )
        .addTo(group);
    });
    group.addTo(this.map);
  },

  addTweets(tweets) {
    this.tweetsData = tweets;
  },

  addHeatmap(geojson) {
    this.riskHeatmapData = geojson;
    this.addRiskHeatmap();
  },

  setScenarioData(data) {
    this.scenarioData = data;
  },

  setRainfallData(data) {
    this.rainfallData = data;
  },

  updateDisplay(currentTime) {
    const currentTimeNum = parseInt(currentTime);
    const currentDepths = {};

    if (this.scenarioData && this.scenarioData.points) {
      const timeIndex = this.scenarioData.time_axis.indexOf(currentTimeNum);

      if (timeIndex !== -1) {
        this.scenarioData.points.forEach((point, index) => {
          const key = 'N' + (index + 1);
          if (this.markers[key] && point.data[timeIndex] !== undefined) {
            const depthM = parseFloat(point.data[timeIndex]) || 0;
            const depthCm = depthM * 100;
            currentDepths[key] = depthCm;
            const color = this.getColor(depthCm);

            this.markers[key].setStyle({
              fillColor: color
            });
            this.markers[key].setPopupContent(
              `<b>${point.name}</b><br>` +
              `积水深度: ${depthCm.toFixed(1)} cm`
            );
          }
        });
      }
    }

    return currentDepths;
  },

  toggleLayer(layerName, visible) {
    const layer = this.layers[layerName];
    if (!layer) return;
    if (visible) {
      layer.addTo(this.map);
    } else {
      this.map.removeLayer(layer);
    }
  }
};
