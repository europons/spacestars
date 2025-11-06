//DECLARACIÓN DE VARIABLES GLOBALES//

var canvas, ctx;
var naveX = 0; //Posición original en x de la nave
var naveY = 0; //Posición original en y de la nave
var tiempo = new Date(30000); //Tiempo en milisegundos (30 segundos)
var contador= 100; //Contador de movimientos

//Variable para parar el temporizador y el cambio de asteroides
var stop; 
var intervalAsteroides; 

//Variables para las imágenes y objetos del juego
var nave = new Image(); 
var fondoNave = new Image();

var imagenBase = new Image(); 

var imagenAsteroide = new Image(); 
var asteroides = []; 

var imagenReloj = new Image();
var reloj = { posX: 0, posY: 0, ancho: 50, alto: 50 };
var fondoReloj = new Image();

var imagenEnergia = new Image();
var energia = { posX: 0, posY: 0, ancho: 50, alto: 50 };
var fondoEnergia = new Image();

var imagenPortal = new Image();
var portalEntrada = { posX: 0, posY: 0, ancho: 100, alto: 100 };
var portalSalida = { posX: 0, posY: 0, ancho: 100, alto: 100 };

//Constantes de tamaño
const altoCanvas = 765;
const anchoCanvas = 1805;
const altoBase = 120;
const anchoBase = 120;
const altoAsteroide = 80;
const anchoAsteroide = 80;
const altoNave = 80;
const anchoNave = 80;

const margenBorrado = 1; //Margen para borrar los asteroides


//FUNCIONES//

//Pantalla inicial del juego
function pantallaInicio() {
    canvas = document.getElementById("miCanvas");
    ctx = canvas.getContext("2d");
    const fondo = new Image();
    fondo.src = "./images/fondoGalaxia.png";

    //Cuando la imagen esté cargada, se dibuja en el canvas
    fondo.onload = function () {
        ctx.drawImage(fondo, 0, 0, canvas.width, canvas.height);

        // Configuración sombra del texto
        ctx.shadowColor = "#00ffff";
        ctx.shadowBlur = 20;           
        ctx.shadowOffsetX = 2;         
        ctx.shadowOffsetY = 2;          

        // Texto de la portada
        ctx.fillStyle = "white";
        ctx.font = "bold 80px Sixtyfour";
        ctx.textAlign = "center";
        ctx.fillText("Space Stars", canvas.width / 2, canvas.height / 6);

        // Subtítulo
        ctx.font = "bold 30px Momo Signature";
        ctx.fillText("by Javi García", canvas.width / 2, canvas.height / 6 + 60);

        // Restablecer sombra
        ctx.shadowColor = "transparent";
    };
}


//Iniciar el juego al pulsar el botón
function iniciarJuego() {
    // Ocultar el botón
    document.getElementById("btnIniciar").style.display = "none";

    // Limpiar el canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    //Cuenta regresiva inicial de 3 segundos
    var cuentaAtras = 3;
    var intervalo = setInterval(function() {
        // Limpia el canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        // Muestra la cuenta atrás
        ctx.fillStyle = "white";
        ctx.font = "bold 300px Sixtyfour";
        ctx.textAlign = "center";
        ctx.fillText(cuentaAtras, canvas.width / 2, canvas.height / 2);
        cuentaAtras--;
        if (cuentaAtras < 0) {
            clearInterval(intervalo);
            // Inicia el juego después de la cuenta atrás
            canvasStars(); ;
        }
    }, 1000); // Intervalo de 1 segundo
}
  


//Inicio del juego
function canvasStars(){

    //Obtengo el elemento canvas
    canvas = document.getElementById("miCanvas");

    //Especifico el contexto 2D
    ctx = canvas.getContext("2d");

    // Cambiar el mensaje inicial
    var spanMensaje = document.getElementById("mensaje");
    spanMensaje.innerHTML = "Adelante, piloto! Usa las flechas o WASD para mover la nave.";

    //Muestro el marcador
    document.getElementById("marcador").style.display = "flex";

    pintarFondo();

    pintarBase();

    pintarNave();

    pintarPortales();
    
    setTimeout(pintarReloj, 100);
    
    setTimeout(pintarEnergia, 100);
    
    setTimeout(pintarAsteroides, 500);

    temporizador();
    
    setTimeout(cambiarAsteroides, 1000);

    window.addEventListener('keydown', moverNave, true);//Evento para mover la nave con las flechas del teclado o WASD
}



//Pintar el fondo con las estrellas
function pintarFondo() {
    //Crear un degradado 
    const gradiente = ctx.createLinearGradient(0, 0, 0, altoCanvas);
    gradiente.addColorStop(0, "#808080");   // parte superior gris medio
    gradiente.addColorStop(0.5, "#333333"); // centro gris oscuro
    gradiente.addColorStop(1, "#000000");   // parte inferior negra

    //Rellenar el fondo del canvas con el degradado
    ctx.fillStyle = gradiente;
    ctx.fillRect(0, 0, anchoCanvas, altoCanvas);

    //Crear la imagen de la estrella
    const imagenEstrella = new Image();
    imagenEstrella.src = "./images/estrella.png";

    //Cuando la estrella esté cargada, dibujar las estrellas en posiciones aleatorias
    imagenEstrella.onload = function() {
        for (let i = 0; i < 100; i++) {
            const x = Math.random() * anchoCanvas;
            const y = Math.random() * altoCanvas;
            ctx.drawImage(imagenEstrella, x, y, 20, 20);//Estrellas de 20x20 px
        }
    };
}



//Pintar la nave
function pintarNave(){

    nave.src = "./images/nave.png"; //Ruta de la imagen

    //Cuando la imagen esté cargada, se dibuja en el canvas
    nave.onload = function() {  
        fondoNave = ctx.getImageData(naveX, naveY, altoNave, anchoNave); //Capturo el fondo que voy a tapar
        ctx.drawImage(nave, naveX, naveY, altoNave, anchoNave); //Dibujo la nave en la esquina superior izquierda (0,0)
    };

}



//Pintar la base
function pintarBase(){

    imagenBase.src = "./images/base.png"; //Ruta de la imagen

    //Cuando la imagen esté cargada, la dibujo en el canvas
    imagenBase.onload = function() {  
        ctx.drawImage(imagenBase, anchoCanvas - anchoBase, altoCanvas - altoBase, anchoBase, altoBase); //Dibujo la base en la esquina inferior derecha con tamaño definido en las constantes
    };

}




//Pintar asteroides
function pintarAsteroides() {

    imagenAsteroide.src = "./images/asteroide.png";

    //Cuando la imagen esté cargada, se empiezan a dibujar los asteroides
    imagenAsteroide.onload = function() {
        asteroides = [];

        // Calcular posiciones y tamaños
        for (let i = 0; i < 30; i++) {
            let x = Math.random() * anchoCanvas;
            let y = Math.random() * altoCanvas;
            let tamanyAsteroide = Math.random() * 60 + 40;

            // Comprobar colisión con la NAVE
            if (
                x < naveX + 100 &&
                x + tamanyAsteroide > naveX &&
                y < naveY + 100 &&
                y + tamanyAsteroide > naveY
            ) {
                // Desplazar a la derecha de la nave
                x = naveX + 100;
                
                // Si se sale del canvas, desplazar a la izquierda
                if (x + tamanyAsteroide > anchoCanvas) {
                    x = naveX - tamanyAsteroide - 20;
                }
            }

            // Comprobar colisión con la BASE
            if (x + tamanyAsteroide > anchoCanvas - anchoBase && y + tamanyAsteroide > altoCanvas - altoBase) {
                x -= anchoBase + tamanyAsteroide; 
                y -= altoBase + tamanyAsteroide;
            }

            // Almacenar datos del asteroide
            asteroides.push({ 
                posX: x, 
                posY: y, 
                ancho: tamanyAsteroide, 
                alto: tamanyAsteroide,
                fondo: null 
            });
        }

        // Capturar todos los fondos 
        for (let asteroide of asteroides) {
            asteroide.fondo = ctx.getImageData(
                asteroide.posX - margenBorrado, 
                asteroide.posY - margenBorrado, 
                asteroide.ancho + (margenBorrado * 2), 
                asteroide.alto + (margenBorrado * 2)
            );
        }

        // Dibujar todos los asteroides
        for (let asteroide of asteroides) {
            ctx.drawImage(imagenAsteroide, asteroide.posX, asteroide.posY, asteroide.ancho, asteroide.alto);
        }
    };
}


//Pintar reloj
function pintarReloj(){

    imagenReloj.src = "./images/reloj.png"; //Ruta de la imagen

    //Cuando la imagen esté cargada, la dibujo en el canvas
    imagenReloj.onload = function() {
        // Posiciones aleatorias dentro del canvas
        let x = Math.random() * anchoCanvas;
        let y = Math.random() * altoCanvas;  

        //Evitar que salgan fuera del canvas
        if (x > anchoCanvas - 50) {
            x = anchoCanvas - 100;
        }
        if (x < 8) {
            x = 50;
        }
        if (y < 8) {
            y = 50;
        }
        if (y > altoCanvas - 50) {
            y = altoCanvas - 100;
        }
        
        // Evitar que salgan encima de la nave (zona inicial)
        if (x < anchoNave && y < altoNave) {
            x += altoNave;
            y += anchoNave;
        }

        // Evitar que salgan encima de la base (zona final)
        if (x > anchoCanvas - anchoBase && y > altoCanvas - altoBase) {
            x -= anchoBase; 
            y -= altoBase;
        }

        reloj = { posX: x, posY: y, ancho: 50, alto: 50 };

        fondoReloj = ctx.getImageData(x, y, 50, 50); //Capturo el fondo que voy a tapar
        
        ctx.drawImage(imagenReloj, x, y, 50, 50); //Dibujo el reloj en la esquina superior izquierda con tamaño 50x50
    };

}

//Pintar energía
function pintarEnergia(){

    imagenEnergia.src = "./images/energia.png"; //Ruta de la imagen
    //Cuando la imagen esté cargada, la dibujo en el canvas
    imagenEnergia.onload = function() {
        // Posiciones aleatorias dentro del canvas
        let x = Math.random() * anchoCanvas;
        let y = Math.random() * altoCanvas;  

        //Evitar que salgan fuera del canvas
        if (x > anchoCanvas - 50) {
            x = anchoCanvas - 100;
        }

        if (x < 8) {
            x = 50;
        }

        if (y < 8) {
            y = 50;
        }

        if (y > altoCanvas - 50) {
            y = altoCanvas - 100;
        }
        
        // Evitar que salgan encima de la nave (zona inicial)
        if (x < 80 && y < 80) {
            x += 100;
            y += 100;
        }

        // Evitar que salgan encima de la base (zona final)
        if (x > anchoCanvas - anchoBase && y > altoCanvas - altoBase) {
            x -= 100; 
            y -= 100;
        }

        //Evitar que salgan encima del reloj
        const margenReloj = 100;
        if (
            x + margenReloj < reloj.posX + reloj.ancho - margenReloj &&
            x + 50 - margenReloj > reloj.posX + margenReloj &&
            y + margenReloj < reloj.posY + reloj.alto - margenReloj &&
            y + 50 - margenReloj > reloj.posY + margenReloj
        ) {
            x += 100;
            y += 100;
        }

        energia = { posX: x, posY: y, ancho: 50, alto: 35 };
        fondoEnergia = ctx.getImageData(x, y, 50, 35); //Capturo el fondo que voy a tapar
        ctx.drawImage(imagenEnergia, x, y, 50, 35); //Dibujo la energia
    };
}

//Pintar portales

function pintarPortales(){

    imagenPortal.src = "./images/portal.png"; //Ruta de la imagen
    //Cuando la imagen esté cargada, la dibujo en el canvas
    imagenPortal.onload = function() {

        // Portal de ENTRADA → mitad izquierda del canvas
        let posXEntrada = Math.random() * ((anchoCanvas / 2) - 100);
        let posYEntrada = Math.random() * (altoCanvas - 100);

        // Portal de SALIDA → mitad derecha del canvas
        let posXSalida = (anchoCanvas / 2) + Math.random() * ((anchoCanvas / 2) - 100);
        let posYSalida = Math.random() * (altoCanvas - 100);

        //Evitar que salgan fuera del canvas
        if (posXEntrada > anchoCanvas - 50 && posXSalida > anchoCanvas - 50) {
            posXEntrada = anchoCanvas - 100;
            posXSalida = anchoCanvas - 200;
        }

        if (posXEntrada < 8 && posXSalida < 8) {
            posXEntrada = 50;
            posXSalida = 150;
        }

        if (posYEntrada < 8 && posYSalida < 8) {
            posYEntrada = 50;
            posYSalida = 150;
        }

        if (posYEntrada > altoCanvas - 50 && posYSalida > altoCanvas - 50) {
            posYEntrada = altoCanvas - 100;
            posYSalida = altoCanvas - 200;
        }
        
        // Evitar que salgan encima de la nave (zona inicial)
        if (posXEntrada < 80 && posYEntrada < 80) {
            posXEntrada += 100;
            posYEntrada += 100;
        }


        // Evitar que salgan encima de la base (zona final)
        if (posXEntrada > anchoCanvas - anchoBase && posYEntrada > altoCanvas - altoBase) {
            posXEntrada -= 100; 
            posYEntrada -= 100;
        }

        portalEntrada = { posX: posXEntrada, posY: posYEntrada, ancho: 100, alto: 100 };
        portalSalida = { posX: posXSalida, posY: posYSalida, ancho: 100, alto: 100 };

        ctx.drawImage(imagenPortal, posXEntrada, posYEntrada, 100, 100); //Dibujar el portal de entrada
        ctx.drawImage(imagenPortal, posXSalida, posYSalida, 100, 100); //Dibujar el portal de salida


    };


}



//Mover la nave
function moverNave(evento) {
    // Borra la nave anterior (pinta el fondo donde estaba)
    ctx.putImageData(fondoNave, naveX, naveY);

    switch(evento.keyCode) {
        // Izquierda
        case 37:
        case 65:
            naveX -= 40;
            detectarColision();
            break;
        // Derecha
        case 39:
        case 68:
            naveX += 40;
            detectarColision();
            break;
        // Arriba
        case 38:
        case 87:
            naveY -= 40;
            detectarColision();
            break;
        // Abajo
        case 40:
        case 83:
            naveY += 40;
            detectarColision();
            break;
        default:
            return; 
    }

    // Actualiza el contador
    actualizarContador();

    // Guarda el nuevo fondo que va debajo de la nave
    fondoNave = ctx.getImageData(naveX, naveY, 80, 80);

    // Dibuja la nave en su nueva posición
    ctx.drawImage(nave, naveX, naveY, 80, 80);

}



//Actualizar el contador y detectar si se ha quedado sin movimientos
function actualizarContador(){

    //Decremento en cada movimiento
    contador--;

    //Capturo el elemento en el que escribir la puntuación
    var spanPuntuacion = document.getElementById("puntuacion");

    //Actualizo el contador
    spanPuntuacion.innerHTML = contador;

    //Compruebo el valor para cambiar el color del texto
    if (contador < 10){
        spanPuntuacion.style.color = "red";
    }else if (contador < 25){
        spanPuntuacion.style.color = "orange";
    }else{
        spanPuntuacion.style.color = "black";
    }

    //Compruebar si se ha quedado sin puntos para finalizar el juego
    if (contador == 0){
        finalizar("🪫¡LOW BATTERY! Te has quedado sin energía.​🪫​");
    }
}

//Mostrar mensaje final de victoria o derrota
function mensajeFinalWin(){
    const mensajeFinal = document.getElementById("mensajeFinal");
    mensajeFinal.style.color = "yellowgreen";
    mensajeFinal.innerHTML = "!ENHORABUENA!";
    //Cambio el texto del botón de reiniciar
    document.getElementById("btnReiniciar").innerHTML = "¡JUGAR OTRA VEZ!";
}

function mensajeFinalLose(){
    const mensajeFinal = document.getElementById("mensajeFinal");
    mensajeFinal.style.color = "red";
    mensajeFinal.innerHTML = "GAME OVER";
    //Cambio el texto del botón de reiniciar
    document.getElementById("btnReiniciar").innerHTML = "Reintentar";
}

//Detecto colisiones con la base, los asteroides o si se sale del mapa
function detectarColision() {

    //Comprobar colisión con cada asteroide
    for (let asteroide of asteroides) {
        if (
            naveX < asteroide.posX + asteroide.ancho &&
            naveX + 80 > asteroide.posX &&
            naveY < asteroide.posY + asteroide.alto &&
            naveY + 80 > asteroide.posY
        ) {
            //Cambio la imagen de la nave por la rota
            nave.src = "./images/naveRota.png"; //Ruta de la imagen
            mensajeFinalLose();
            finalizar("💥¡Has chocado con un asteroide!");
            return; 
        }
    }

    //Comprobar colisión con la base
    const baseX = anchoCanvas - anchoBase;
    const baseY = altoCanvas - altoBase;

    if (
        naveX < baseX + anchoBase &&
        naveX + 80 > baseX &&
        naveY < baseY + altoBase &&
        naveY + 80 > baseY
    ) {


        mensajeFinalWin();

        nave.src = "./images/astronauta.png"; //Cambio la imagen de la nave por el astronauta celebrando
        finalizar("🏁 Has llegado a la base.");
        return;
    }

    //Comprobar si se sale del mapa
    if (
        naveX < 0 || naveX + 80 > anchoCanvas ||
        naveY < 0 || naveY + 80 > altoCanvas
    ) {
        mensajeFinalLose();
        finalizar("🚫 ¡Te has salido del espacio!");
        return;
    }

    //Comprobar colisión con el reloj
    if (
        naveX < reloj.posX + reloj.ancho &&
        naveX + 80 > reloj.posX &&
        naveY < reloj.posY + reloj.alto &&
        naveY + 80 > reloj.posY
    ) {
        //Desaparecer el reloj del canvas
        ctx.putImageData(fondoReloj, reloj.posX, reloj.posY);
        //Reiniciar la variable del reloj para que no vuelva a colisionar
        reloj = { posX: -100, posY: -100, ancho: 0, alto: 0 };
        // Aumentar tiempo en 10 segundos
        var ms = tiempo.getMilliseconds() + 10000;
        tiempo.setMilliseconds(ms); 
    }

    //Comprobar colisión con la energía
    if (
        naveX < energia.posX + energia.ancho &&
        naveX + 80 > energia.posX &&
        naveY < energia.posY + energia.alto &&
        naveY + 80 > energia.posY
    ) {
        //Desaparecer la energía del canvas
        ctx.putImageData(fondoEnergia, energia.posX, energia.posY);
        //Reiniciar la variable de la energía para que no vuelva a colisionar
        energia = { posX: -100, posY: -100, ancho: 0, alto: 0 };
        // Aumentar movimientos en 20
        contador += 20;
        //Actualizo el contador en pantalla
        var spanPuntuacion = document.getElementById("puntuacion");
        spanPuntuacion.innerHTML = contador;
        spanPuntuacion.style.color = "black";
    }

    //Comprobar colisión con el portal de entrada
    if (
        naveX < portalEntrada.posX + portalEntrada.ancho &&
        naveX + 80 > portalEntrada.posX &&
        naveY < portalEntrada.posY + portalEntrada.alto &&
        naveY + 80 > portalEntrada.posY
    ) {
        // Teletransportar la nave al portal de salida
        naveX = portalSalida.posX;
        naveY = portalSalida.posY;
    }

}


//Finalizar el juego
function finalizar(mensaje){

    //Escribo el mensaje en el elemento
    document.getElementById("mensaje").innerHTML = mensaje;

    //Bloqueo el movimiento del teclado
    window.removeEventListener("keydown", moverNave, true);

    //Paro el temporizador y el cambio de asteroides
    clearTimeout(stop);
    clearInterval(intervalAsteroides);

    //Muestro el botón de reiniciar con hidden false
    document.getElementById("btnReiniciar").hidden = false;

    //Muestro el mensaje final en el canvas
    document.getElementById("mensajeFinal").hidden = false;
}


//Temporizador
function temporizador(){

    //Decremento 500 milisegundos
    var ms = tiempo.getMilliseconds() - 500;
    tiempo.setMilliseconds(ms);


    //Muestro la nueva fecha
    var texto = rellenaCeros(tiempo.getMinutes()) + ":" + rellenaCeros(tiempo.getSeconds());
    var spanTiempo = document.getElementById("tiempo");
    spanTiempo.innerHTML = texto;


    //Compruebo el valor para cambiar el color del texto
    if (tiempo.getSeconds() < 6){
        spanTiempo.style.color = "red";
    }else if (tiempo.getSeconds() < 11){
        spanTiempo.style.color = "#ff7700";
    }else{
        spanTiempo.style.color = "black";
    }


    //Compruebo si llega a 0 para finalizar el juego o continuar
    if (tiempo.getSeconds() <= 0){
        var mensaje = "¡Lo siento! Se ha terminado el tiempo.";
        mensajeFinalLose();
        finalizar(mensaje);
    }else{
        //Hago un loop para que se ejecute cada 500ms
        stop = setTimeout(temporizador,500);
    }
}


function rellenaCeros(numero){
    if (numero < 10){
        return "0" + numero;
    }else{ 
        return numero;
    }
}

//Reiniciar el juego
function reiniciarJuego() {
    // Detener temporizador y el cambio de asteroides
    clearTimeout(stop);
    clearInterval(intervalAsteroides);

    // Reiniciar variables
    naveX = 0;
    naveY = 0;
    contador = 100;
    tiempo = new Date(30000);
    asteroides = [];

    // Limpiar el canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Reiniciar texto y colores del marcador
    document.getElementById("puntuacion").innerHTML = contador;
    document.getElementById("puntuacion").style.color = "black";
    document.getElementById("mensaje").innerHTML = "Esquiva los asteroides y alcanza la base antes de quedarte sin tiempo... ¡y sin energía!";
    document.getElementById("tiempo").style.color = "black";

    // Reanudar controles
    window.addEventListener('keydown', moverNave, true);

    //Ocultar el botón de reiniciar con hidden false
    var btnReiniciar = document.getElementById("btnReiniciar");
    btnReiniciar.hidden = true;

    //Ocultar el mensaje final
    var mensajeFinal = document.getElementById("mensajeFinal");
    mensajeFinal.hidden = true;

    // Iniciar de nuevo el juego
    iniciarJuego();
}

//Cambiar asteroides cada cierto tiempo
function cambiarAsteroides() {
    intervalAsteroides = setInterval(() => {
        for (let asteroide of asteroides) {
            // Restaurar el fondo original de este asteroide
            ctx.putImageData(asteroide.fondo, asteroide.posX, asteroide.posY);
        }

        // Esperar un momento para que el canvas se limpie
        setTimeout(() => {
            asteroides = [];
            pintarAsteroides();
        }, 50);

    }, 2500); // Cambiar cada 2.5 segundos

}