function punto_mas_bajoY(a, b)
{
    if(a.y < b.y)
    {
        return true;
    } 
    else if(a.y === b.y && a.x < b.x)
    {
        return true;
    }
    else {return false;}
}

function orientacion(a, b, c)
{
    let area = (b.y - a.y)*(c.x - b.x) - (b.x - a.x)*(c.y - b.y);
    if(area < 0) return -1;
    if(area > 0) return 1;
    if(area === 0) return 0;
}

function borde(puntos) 
{
    let n_puntos = puntos.length;
    if (n_puntos < 3) {
        
        return ("Error");
    }
    
    let punto_mas_bajo = 0;
    for (let i = 0; i < n_puntos; i++) {
      if (puntos[i].y < puntos[punto_mas_bajo].y ||
          (puntos[i].y == puntos[punto_mas_bajo].y &&
           puntos[i].x < puntos[punto_mas_bajo].x)) {
        punto_mas_bajo = i;
      }
    }
    
    [puntos[0], puntos[punto_mas_bajo]] = [puntos[punto_mas_bajo], puntos[0]];
    
    for (let i = 0; i < n_puntos; i++) {
      let angulo_i = Math.atan2(puntos[i].y - puntos[0].y, puntos[i].x - puntos[0].x);
      for (let j = i + 1; j < n_puntos; j++) {
        let angulo_j = Math.atan2(puntos[j].y - puntos[0].y, puntos[j].x - puntos[0].x);
        if (angulo_j < angulo_i || (angulo_j == angulo_i && puntos[j].x < puntos[i].x)) {
          [puntos[i], puntos[j]] = [puntos[j], puntos[i]];
          angulo_i = angulo_j;
        }
      }
    }
    
    let envuelve = [puntos[0], puntos[1]];
    for (let i = 2; i < n_puntos; i++) {
      while (orientacion(envuelve[envuelve.length - 2], envuelve[envuelve.length - 1], puntos[i]) !== -1) {
        envuelve.pop();
      }
      envuelve.push(puntos[i]);
    }
    
    return envuelve;
}

let envolturaAnterior = null;

const canvas = document.getElementById("miCanvas");
canvas.width = 1400;
canvas.height = 600;
const ctx = canvas.getContext("2d");
canvas.addEventListener("click", seleccionarPunto);

let puntos = 
[
    {x: 100, y: 70}, 
    {x: 30, y: 20}, 
    {x: 30, y: 70}, 
];
let bordes = borde(puntos);

ctx.fillStyle = "red";
for (let i = 0; i < puntos.length; i++) {
    dibujaPunto(i);
}
function dibujaPunto(i)
{
    ctx.beginPath();
    ctx.arc(puntos[i].x, puntos[i].y, 2, 0, 2 * Math.PI);
    ctx.fill();
}



let screenLog = document.querySelector("#screen-log");
document.addEventListener("mousemove", logKey);
function logKey(e) 
{
  screenLog.innerText = `
    COORDENADAS X/Y: ${e.clientX}, ${e.clientY}`
}
function seleccionarPunto(evento) 
{
    const rect = canvas.getBoundingClientRect();
    const x = evento.clientX - rect.left;
    const y = evento.clientY - rect.top;
    puntos.push({x: x , y: y});
    dibujaPunto(puntos.length - 1);
}


const btnEnvolver = document.getElementById("btnEnvolver");
btnEnvolver.addEventListener("click", envolverPuntos);
  
function envolverPuntos() 
{
    let bordes = borde(puntos);
    ctx.strokeStyle = "blue";
    ctx.beginPath();
    ctx.moveTo(bordes[0].x, bordes[0].y);
    for (let i = 1; i < bordes.length; i++) 
    {
        ctx.lineTo(bordes[i].x, bordes[i].y);
    }
    ctx.closePath();
    ctx.stroke();
    if (envolturaAnterior !== null) 
    {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < puntos.length; i++) {
            dibujaPunto(i);
        }
        envolverPuntosNuevo();
    }
    envolturaAnterior = bordes;
}


function envolverPuntosNuevo() 
{
    let bordes = borde(puntos);
    ctx.strokeStyle = "blue";
    ctx.beginPath();
    ctx.moveTo(bordes[0].x, bordes[0].y);
    for (let i = 1; i < bordes.length; i++) 
    {
        ctx.lineTo(bordes[i].x, bordes[i].y);
    }
    ctx.closePath();
    ctx.stroke();
    envolturaAnterior = bordes;
}
function borrarLienzo()
{
    ctx.clearRect (0, 0, canvas.width, canvas.height);
    return puntos=[];
}