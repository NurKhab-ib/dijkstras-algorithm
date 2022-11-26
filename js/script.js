'use strict';

window.onload = function() {
  const lang = document.documentElement.lang;

  let canvas = document.getElementById('canvas'), ctx = canvas.getContext('2d');

  ctx.canvas.width = window.innerWidth / 1.5;
  ctx.canvas.height = window.innerHeight / 1.5;

  let centerX = ctx.canvas.width / 2, centerY = ctx.canvas.height / 2;
  
  function getRandom(min, max) {
    return Math.round(Math.random() * (max - min) + min);
  }

  let edge12 = getRandom(3, 9), edge13 = getRandom(1, 9), edge24 = getRandom(1, 7), edge25 = getRandom(4, 9), 
      edge26 = getRandom(4, 9), edge36 = getRandom(3, 9), edge67 = getRandom(1, 9), 
      edge47 = getRandom(6, 9), edge57 = getRandom(4, 9); 

  const edge = [ // массив рёбер (вершина 1, вершина 2, дистанция)
    [0, 1, edge12],
    [0, 2, edge13],
    [1, 3, edge24],
    [1, 4, edge25],
    [1, 5, edge26],
    [2, 5, edge36],
    [3, 6, edge47], 
    [4, 6, edge57],
    [5, 6, edge67]
  ];

  let matrix = [
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0]
  ];

  edge.forEach(function(e) {
    matrix[e[0]][e[1]] = e[2];
    matrix[e[1]][e[0]] = e[2];
  });

  const vertex = [{ // массив вершин
    id: '1',
    curId: 'cur_1',
    usedId: 'used_1',
    x: centerX,
    y: 50
  }, {
    id: '2',
    curId: 'cur_2',
    usedId: 'used_2',
    x: centerX / 2,
    y: centerY / 2
  }, {
    id: '3',
    curId: 'cur_3',
    usedId: 'used_3',
    x: centerX * 1.5,
    y: centerY / 2
  }, {
    id: '4',
    curId: 'cur_4',
    usedId: 'used_4',
    x: centerX / 4,
    y: centerY
  }, {
    id: '5',
    curId: 'cur_5',
    usedId: 'used_5',
    x: centerX / 1.4,
    y: centerY
  }, {
    id: '6',
    curId: 'cur_6',
    usedId: 'used_6',
    x: centerX * 1.5,
    y: centerY
  }, {
    id: '7',
    curId: 'cur_7',
    usedId: 'used_7',
    x: centerX,
    y: centerY * 1.8
  }];

  let m = document.getElementById('matrix'), res = '';

  for (let i = 0; i < matrix.length; i++) {
    res += `<b>${i + 1}:</b> `;
    for (let j = 0; j < 7; j++) {
      res += matrix[i][j] + ' ';
    }
    res += '<br>';
  }

  m.innerHTML = res;

  const drawGraph = function() {
    ctx.fillStyle = "#e5e5e5";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    edge.forEach(function(e) { // отрисовка рёбер
      ctx.strokeStyle = "#000";

      ctx.beginPath();
      ctx.moveTo(vertex[e[0]].x, vertex[e[0]].y);
      ctx.lineTo(vertex[e[1]].x, vertex[e[1]].y);
      ctx.stroke();
    });

    vertex.forEach(function(v) { // отрисовка вершин
      const vx = document.getElementById(v.id), halfX = vx.naturalWidth / 2, halfY = vx.naturalHeight / 2;
      ctx.drawImage(vx, v.x - halfX, v.y - halfY);
    });
  };

  drawGraph();

  // визуализация алгоритма

  const inf = 10000;
  let play = document.getElementById('continueButton'), result = document.getElementById('minDist');

  let i = 1, curDist = 0;

  let usedVx, oldNextVx = vertex[0], usedVertexes = [], end = false;

  let dist = {
    0: [0, inf, inf, inf, inf, inf, inf],
    1: [-1, inf, inf, inf, inf, inf, inf],
    2: [-1, inf, inf, inf, inf, inf, inf],
    3: [-1, inf, inf, inf, inf, inf, inf],
    4: [-1, inf, inf, inf, inf, inf, inf],
    5: [-1, inf, inf, inf, inf, inf, inf],
    6: [-1, inf, inf, inf, inf, inf, inf]
  };

  const doAlg = function() {
    let d = document.getElementById('dist'), res_ = '';
    
    for (let j = i - 1; j < i; j++) {
      res_ += `<b>№ ${j + 1}:</b> `;
      for (let q = 0; q < 7; q++) {
        if (dist[j][q] === inf) {
          res_ += '∞ ';
        } else if (dist[j][q] === -1) {
          res_ += '⊝ ';
        } else {
          res_ += `${dist[j][q]} `;
        }
      }

      res_ += '<br>';
    }

    d.innerHTML += res_;

    if (i === matrix.length) {
      play.disabled = true;
    }

    if (lang === 'ru') {
      play.innerHTML = 'Далее';
    } else {
      play.innerHTML = 'Next';
    }
    usedVx = oldNextVx;

    usedVertexes.push(usedVx.id - 1);

    let nextVx = {};
  
    // отрисовка рассмотренной вершины
    const vx = document.getElementById(usedVx.usedId), halfX = vx.naturalWidth / 2, halfY = vx.naturalHeight / 2;
    ctx.drawImage(vx, usedVx.x - halfX, usedVx.y - halfY);

    // определение рассматриваемой вершины
    let minE = Number.MAX_VALUE;

    edge.forEach(function(e) {
      if (e[0] === usedVx.id - 1 && usedVertexes.indexOf(e[1]) === -1) {
        dist[i][e[1]] = e[2] + curDist;
      } else if (e[1] === usedVx.id - 1 && usedVertexes.indexOf(e[0]) === -1) {
        dist[i][e[0]] = e[2] + curDist;
      }

      if (e[2] < minE) {
        if (e[0] === usedVx.id - 1 && usedVertexes.indexOf(e[1]) === -1) {
          minE = e[2];
          nextVx = vertex[e[1]];
        } else if (e[1] === usedVx.id - 1 && usedVertexes.indexOf(e[0]) === -1) {
          minE = e[2];
          nextVx = vertex[e[0]];
        }
      }
    });
    
    curDist += minE;

    usedVertexes.forEach(function(v) {
      dist[i][v] = -1;
    });
    
    // отрисовка рассматриваемой вершины
    const vx_ = document.getElementById(nextVx.curId), halfX_ = vx_.naturalWidth / 2, halfY_ = vx_.naturalHeight / 2;
    ctx.drawImage(vx_, nextVx.x - halfX_, nextVx.y - halfY_);

    oldNextVx = nextVx;

    i++;
  };

  play.addEventListener('click', function(e) {
    doAlg();
  });
};
