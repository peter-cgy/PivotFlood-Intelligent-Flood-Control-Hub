window.CONFIG = {
  MAP_CENTER: [31.031, 121.452],
  MAP_ZOOM: 16,
  CAMPUS_BOUNDS: [[31.025, 121.440], [31.042, 121.462]],

  LOCATION_MAPPING: {
    'N1': { name: '图书馆', lat: 31.033, lng: 121.456 },
    'N2': { name: '银杏路', lat: 31.031, lng: 121.452 },
    'N3': { name: '地下车库', lat: 31.029, lng: 121.449 },
    'N4': { name: '教学楼', lat: 31.030, lng: 121.455 },
    'N5': { name: '宿舍区', lat: 31.032, lng: 121.450 }
  },

  RESILIENCE_MAPPING: {
    '图书馆': 'N1',
    '地下车库': 'N3',
    '校医院': 'N4'
  },

  SCENARIO_POINT_COORDS: {
    '图书馆':   { lat: 31.033,   lng: 121.456 },
    '银杏路':   { lat: 31.032,   lng: 121.452 },
    '地下车库': { lat: 31.0335,  lng: 121.4565 }
  },

  DEPTH_THRESHOLDS: [
    { min: 0.40, color: '#ff2d2d', glow: 'rgba(255,45,45,0.6)',  label: '严重' },
    { min: 0.27, color: '#ff8c00', glow: 'rgba(255,140,0,0.5)',  label: '较重' },
    { min: 0.15, color: '#ffd700', glow: 'rgba(255,215,0,0.4)',  label: '中等' },
    { min: 0.01, color: '#00bfff', glow: 'rgba(0,191,255,0.3)',  label: '轻微' }
  ],

  SCENARIO_FILES: {
    scenario_20yr:   'generated_data/scenario_20yr.json',
    scenario_50yr:   'generated_data/scenario_50yr.json',
    intervention_A:  'generated_data/intervention_A.json'
  },

  PLAY_INTERVAL_MS: 200,
  PLAY_STEP: 2
};
