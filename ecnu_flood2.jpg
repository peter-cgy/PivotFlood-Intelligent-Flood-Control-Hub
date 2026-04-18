window.Decision = {
  rules: [
    {
      point: '地下车库',
      threshold: 0.40,
      level: 'danger',
      message: '地下车库积水超过40cm，建议立即封闭入口，启动应急排水泵，疏散车辆'
    },
    {
      point: '地下车库',
      threshold: 0.25,
      level: 'warning',
      message: '地下车库积水较深，建议堆放沙袋、准备排水设备，禁止车辆进入'
    },
    {
      point: '图书馆',
      threshold: 0.30,
      level: 'danger',
      message: '图书馆周边积水严重，建议关闭地下通道，转移一楼珍贵藏书'
    },
    {
      point: '图书馆',
      threshold: 0.15,
      level: 'warning',
      message: '图书馆区域出现积水，建议铺设防滑垫，提醒师生注意安全'
    },
    {
      point: '银杏路',
      threshold: 0.25,
      level: 'warning',
      message: '银杏路积水较深，建议临时封路，引导车辆和行人绕行樱桃河路'
    },
    {
      point: '银杏路',
      threshold: 0.10,
      level: 'info',
      message: '银杏路出现轻微积水，请注意通行安全'
    }
  ],

  evaluate(depthMap, scenarioKey) {
    const suggestions = [];
    const matched = new Set();

    for (const rule of this.rules) {
      const depth = depthMap[rule.point] || 0;
      const ruleId = rule.point + '_' + rule.level;
      if (depth >= rule.threshold && !matched.has(rule.point)) {
        suggestions.push({
          level: rule.level,
          point: rule.point,
          depth: depth,
          message: rule.message
        });
        matched.add(rule.point);
      }
    }

    if (scenarioKey === 'intervention_A') {
      suggestions.push({
        level: 'success',
        point: '泵站',
        depth: 0,
        message: '泵站P1已开启，排水能力0.5m³/s，预计可降低积水15-25%'
      });
    }

    if (suggestions.length === 0) {
      suggestions.push({
        level: 'success',
        point: '全局',
        depth: 0,
        message: '当前各监测点积水情况正常，无需特别处置'
      });
    }

    return suggestions;
  },

  render(suggestions) {
    const box = document.getElementById('decision-box');
    const levelIcons = {
      danger: '🔴',
      warning: '🟡',
      info: '🔵',
      success: '🟢'
    };

    box.innerHTML = suggestions.map(s => `
      <div class="decision-item decision-${s.level}">
        <span class="decision-icon">${levelIcons[s.level] || '⚪'}</span>
        <span class="decision-text">${s.message}</span>
      </div>
    `).join('');
  }
};
