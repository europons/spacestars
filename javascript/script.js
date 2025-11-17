//CONSTANTES GLOBALES//

//Constantes de tamañoS
const altoCanvas = 765;
const anchoCanvas = 1805;
const altoBase = 120;
const anchoBase = 120;
const altoAsteroide = 80;
const anchoAsteroide = 80;
const altoNave = 80;
const anchoNave = 80;
const altoReloj = 50;
const anchoReloj = 50;
const altoEnergia = 35;
const anchoEnergia = 50;
const altoPortal = 100;
const anchoPortal = 100;

//Constantes de márgenes
const margenBorrado = 1; //Margen para borrar los asteroides
const margenSeparacion = 10; //Margen para que no salgan los objetos pegados al borde

//Constantes de juego
const aumentoTiempo = 10000; 
const aumentoEnergia = 20; 
const velocidadAsteroides = 2500; 
const contadorInicial = 100; 
const tiempoInicial = 30000; 

//DECLARACIÓN DE VARIABLES GLOBALES//

var canvas, ctx;
var naveX = 0; //Posición original en x de la nave
var naveY = 0; //Posición original en y de la nave
var tiempo = new Date(tiempoInicial); //Tiempo en milisegundos (30 segundos)
var contador= contadorInicial; //Contador de movimientos

//Variable para parar el temporizador y el cambio de asteroides
var stop; 
var intervalAsteroides; 

//Variables para las imágenes y objetos del juego
var nave = new Image(); 

var imagenBase = new Image(); 

var imagenAsteroide = new Image(); 
var asteroides = []; 

var imagenReloj = new Image();
var reloj = { posX: 0, posY: 0, ancho: 50, alto: 50 };

var imagenEnergia = new Image();
var energia = { posX: 0, posY: 0, ancho: 50, alto: 50 };

var imagenPortal = new Image();
var portalEntrada = { posX: 0, posY: 0, ancho: 100, alto: 100 };
var portalSalida = { posX: 0, posY: 0, ancho: 100, alto: 100 };

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
    // Ocultar el botón y el marcador
    document.getElementById("btnIniciar").style.display = "none";
    document.getElementById("marcador").style.display = "none";

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


//Pintar el fondo (solo degradado, he eliminado el pintado de estrellas por facilidad)
function pintarFondo() {
    //Crear un degradado 
    const gradiente = ctx.createLinearGradient(0, 0, 0, altoCanvas);
    gradiente.addColorStop(0, "#808080");   // parte superior gris medio
    gradiente.addColorStop(0.5, "#333333"); // centro gris oscuro
    gradiente.addColorStop(1, "#000000");   // parte inferior negra

    //Rellenar el fondo del canvas con el degradado
    ctx.fillStyle = gradiente;
    ctx.fillRect(0, 0, anchoCanvas, altoCanvas);
}


// Función para "limpiar" zonas del canvas usando el mismo degradado del fondo
function limpiarZona(x, y, ancho, alto) {
    const gradiente = ctx.createLinearGradient(0, 0, 0, altoCanvas);
    gradiente.addColorStop(0, "#808080");
    gradiente.addColorStop(0.5, "#333333");
    gradiente.addColorStop(1, "#000000");

    ctx.fillStyle = gradiente;
    ctx.fillRect(x, y, ancho, alto);
}

// Redibujar elementos estáticos en sus posiciones actuales
function dibujarBase() {
    ctx.drawImage(imagenBase, anchoCanvas - anchoBase, altoCanvas - altoBase, anchoBase, altoBase);
}

function dibujarPortales() {
    if (portalEntrada && portalEntrada.ancho && portalEntrada.alto) {
        ctx.drawImage(imagenPortal, portalEntrada.posX, portalEntrada.posY, portalEntrada.ancho, portalEntrada.alto);
    }
    if (portalSalida && portalSalida.ancho && portalSalida.alto) {
        ctx.drawImage(imagenPortal, portalSalida.posX, portalSalida.posY, portalSalida.ancho, portalSalida.alto);
    }
}

function dibujarReloj() {
    if (reloj.ancho > 0 && reloj.alto > 0) {
        ctx.drawImage(imagenReloj, reloj.posX, reloj.posY, reloj.ancho, reloj.alto);
    }
}

function dibujarEnergia() {
    if (energia.ancho > 0 && energia.alto > 0) {
        ctx.drawImage(imagenEnergia, energia.posX, energia.posY, energia.ancho, energia.alto);
    }
}

function dibujarNave() {
    ctx.drawImage(nave, naveX, naveY, anchoNave, altoNave);
}


//Pintar la nave
function pintarNave(){

    nave.src = "./images/nave.png"; //Ruta de la imagen

    //Cuando la imagen esté cargada, se dibuja en el canvas
    nave.onload = function() {  
        ctx.drawImage(nave, naveX, naveY, altoNave, anchoNave); //Dibujo la nave en la esquina superior izquierda (0,0)
    };

}


//Pintar la base
function pintarBase(){

    imagenBase.src = "./images/base.png"; //Ruta de la imagen

    //Cuando la imagen esté cargada, la dibujo en el canvas
    imagenBase.onload = function() {  
        ctx.drawImage(imagenBase, anchoCanvas - anchoBase, altoCanvas - altoBase, anchoBase, altoBase); 
    };

}


//Pintar asteroides
function pintarAsteroides() {

    imagenAsteroide.src = "./images/asteroide.png";

    //Cuando la imagen esté cargada, se empiezan a dibujar los asteroides
    imagenAsteroide.onload = function() {
        asteroides = [];

        // Crear posiciones y tamaños
        for (let i = 0; i < 30; i++) {
            let x = Math.random() * anchoCanvas;
            let y = Math.random() * altoCanvas;
            let tamanyAsteroide = Math.random() * 50 + 50; // Tamaño entre 50 y 100 píxeles

            // Comprobar posición para evitar que se pinten encima de la nave
            if (
                x < naveX + altoNave &&
                x + tamanyAsteroide > naveX &&
                y < naveY + anchoNave &&
                y + tamanyAsteroide > naveY
            ) {
                // Desplazar a la derecha o a la izquierda según convenga
                if (x < anchoCanvas / 2) {
                    x = naveX + altoNave + margenSeparacion; 
                } else {
                    x = naveX - tamanyAsteroide - margenSeparacion;
                }

            }

            // Comprobar posición para evitar que se pinten encima de la base
            if (x + tamanyAsteroide > anchoCanvas - anchoBase && y + tamanyAsteroide > altoCanvas - altoBase) {
                x -= anchoBase + tamanyAsteroide; 
                y -= altoBase + tamanyAsteroide;
            }

            // Almacenar datos del asteroide
            asteroides.push({ 
                posX: x, 
                posY: y, 
                ancho: tamanyAsteroide, 
                alto: tamanyAsteroide
            });
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
        if (x > anchoCanvas - anchoReloj - margenSeparacion) {
            x = anchoCanvas - anchoReloj - margenSeparacion;
        }
        if (y > altoCanvas - altoReloj) {
            y = altoCanvas - altoReloj - margenSeparacion ;
        }
        if (x < margenSeparacion) {
            x = margenSeparacion;
        }
        if (y < margenSeparacion) {
            y = margenSeparacion;
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

        reloj = { posX: x, posY: y, ancho: anchoReloj, alto: altoReloj };
        ctx.drawImage(imagenReloj, x, y, anchoReloj, altoReloj); //Dibujo el reloj en la posición aleatoria
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
        if (x > anchoCanvas - anchoEnergia - margenSeparacion) {
            x = anchoCanvas - anchoEnergia - margenSeparacion;
        }
        if (y > altoCanvas - altoEnergia - margenSeparacion) {
            y = altoCanvas - altoEnergia - margenSeparacion ;
        }
        if (x < margenSeparacion) {
            x = margenSeparacion;
        }
        if (y < margenSeparacion) {
            y = margenSeparacion;
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

        //Evitar que salgan encima del reloj
        if (
            x + anchoEnergia + margenSeparacion > reloj.posX &&
            x < reloj.posX + reloj.ancho + margenSeparacion &&
            y + altoEnergia + margenSeparacion > reloj.posY &&
            y < reloj.posY + reloj.alto + margenSeparacion
        ) {
            x += anchoReloj + margenSeparacion;
            y += altoReloj + margenSeparacion;
        }

        energia = { posX: x, posY: y, ancho: anchoEnergia, alto: altoEnergia };
        ctx.drawImage(imagenEnergia, x, y, anchoEnergia, altoEnergia); //Dibujo la energia
    };
}


//Pintar portales
function pintarPortales(){
    imagenPortal.src = "./images/portal.png"; //Ruta de la imagen
    
    //Cuando la imagen esté cargada, la dibujo en el canvas
    imagenPortal.onload = function() {
        // Portal de ENTRADA → mitad izquierda del canvas
        let posXEntrada = Math.random() * ((anchoCanvas / 2) - anchoPortal);
        let posYEntrada = Math.random() * (altoCanvas - altoPortal);
        
        // Portal de SALIDA → mitad derecha del canvas
        let posXSalida = (anchoCanvas / 2) + Math.random() * ((anchoCanvas / 2) - anchoPortal);
        let posYSalida = Math.random() * (altoCanvas - altoPortal);
        
        //Evitar que el portal de ENTRADA salga fuera del canvas
        if (posXEntrada > anchoCanvas - anchoPortal - margenSeparacion) {
            posXEntrada = anchoCanvas - anchoPortal - margenSeparacion;
        }
        if (posYEntrada > altoCanvas - altoPortal - margenSeparacion) {
            posYEntrada = altoCanvas - altoPortal - margenSeparacion;
        }
        if (posXEntrada < margenSeparacion) {
            posXEntrada = margenSeparacion;
        }
        if (posYEntrada < margenSeparacion) {
            posYEntrada = margenSeparacion;
        }
        
        // Evitar que el portal de ENTRADA salga encima de la nave
        if (posXEntrada < anchoNave && posYEntrada < altoNave) {
            posXEntrada += altoNave;
            posYEntrada += anchoNave;
        }
        
        //Evitar que el portal de SALIDA salga fuera del canvas
        if (posXSalida > anchoCanvas - anchoPortal - margenSeparacion) {
            posXSalida = anchoCanvas - anchoPortal - margenSeparacion;
        }
        if (posYSalida > altoCanvas - altoPortal - margenSeparacion) {
            posYSalida = altoCanvas - altoPortal - margenSeparacion;
        }
        
        // Evitar que el portal de SALIDA salga encima de la base
        if (posXSalida > anchoCanvas - anchoBase && posYSalida > altoCanvas - altoBase) {
            posXSalida -= anchoBase;
            posYSalida -= altoBase;
        }
        
        portalEntrada = { posX: posXEntrada, posY: posYEntrada, ancho: anchoPortal, alto: altoPortal };
        portalSalida = { posX: posXSalida, posY: posYSalida, ancho: anchoPortal, alto: altoPortal };
        
        ctx.drawImage(imagenPortal, posXEntrada, posYEntrada, anchoPortal, altoPortal);
        ctx.drawImage(imagenPortal, posXSalida, posYSalida, anchoPortal, altoPortal);
    };
}


//Mover la nave
function moverNave(evento) {
    const pixelesMovimiento = 40; //Cantidad de píxeles que se mueve la nave

    // Guardar la posición anterior de la nave
    const naveXAnterior = naveX;
    const naveYAnterior = naveY;

    // Borrar la zona donde estaba la nave usando el degradado del fondo
    limpiarZona(naveXAnterior, naveYAnterior, anchoNave + margenBorrado, altoNave + margenBorrado);

    // Redibujar todos los elementos por si han sido tapados
    dibujarBase();
    dibujarPortales();
    dibujarReloj();
    dibujarEnergia();

    switch(evento.keyCode) {
        // Izquierda
        case 37:
        case 65:
            naveX -= pixelesMovimiento;
            detectarColision();
            break;
        // Derecha
        case 39:
        case 68:
            naveX += pixelesMovimiento;
            detectarColision();
            break;
        // Arriba
        case 38:
        case 87:
            naveY -= pixelesMovimiento;
            detectarColision();
            break;
        // Abajo
        case 40:
        case 83:
            naveY += pixelesMovimiento;
            detectarColision();
            break;
        default:
            return; 
    }

    // Actualiza el contador
    actualizarContador();

    // Dibuja la nave en su nueva posición
    ctx.drawImage(nave, naveX, naveY, anchoNave, altoNave);

}

//Detecto colisiones con la base, los asteroides o si se sale del mapa
function detectarColision() {

    //Comprobar colisión con cada asteroide
    for (let asteroide of asteroides) {
        // Margen de tolerancia para hacer la colisión más precisa (en píxeles)
        const margenColisionAsteroide = 7; 
        
        if (
            naveX + margenColisionAsteroide < asteroide.posX + asteroide.ancho - margenColisionAsteroide &&
            naveX + anchoNave - margenColisionAsteroide > asteroide.posX + margenColisionAsteroide &&
            naveY + margenColisionAsteroide < asteroide.posY + asteroide.alto - margenColisionAsteroide &&
            naveY + altoNave - margenColisionAsteroide > asteroide.posY + margenColisionAsteroide
        ) {
            //Cambio la imagen de la nave por la rota
            nave.src = "./images/naveRota.png";
            mensajeFinalLose();
            finalizar("💥¡Has chocado con un asteroide!");
            return; 
        }
    }

    //Comprobar si se sale del mapa
    if (
        naveX < 0 || naveX + anchoNave > anchoCanvas ||
        naveY < 0 || naveY + altoNave > altoCanvas
    ) {
        mensajeFinalLose();
        finalizar("🚫 ¡Te has salido del espacio!");
        return;
    }

    //Comprobar colisión con el reloj
    if (
        naveX < reloj.posX + reloj.ancho &&
        naveX + anchoReloj > reloj.posX &&
        naveY < reloj.posY + reloj.alto &&
        naveY + altoReloj > reloj.posY
    ) {
        //Desaparecer el reloj del canvas
        limpiarZona(reloj.posX, reloj.posY, reloj.ancho + margenBorrado, reloj.alto + margenBorrado);
        //Reiniciar la variable del reloj para que no vuelva a colisionar
        reloj = { posX: -100, posY: -100, ancho: 0, alto: 0 };
        // Aumentar tiempo en 10 segundos
        var ms = tiempo.getMilliseconds() + aumentoTiempo;
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
        limpiarZona(energia.posX, energia.posY, energia.ancho + margenBorrado, energia.alto + margenBorrado);
        //Reiniciar la variable de la energía para que no vuelva a colisionar
        energia = { posX: -100, posY: -100, ancho: 0, alto: 0 };
        // Aumentar movimientos en 20
        contador += aumentoEnergia;
        //Actualizo el contador en pantalla
        var spanPuntuacion = document.getElementById("puntuacion");
        spanPuntuacion.innerHTML = contador;
        spanPuntuacion.style.color = "black";
    }

    //Comprobar colisión con el portal de entrada
    const margenColisionPortal = 10; // Opcional: añadir tolerancia

    if (
        naveX + margenColisionPortal < portalEntrada.posX + portalEntrada.ancho - margenColisionPortal &&
        naveX + anchoNave - margenColisionPortal > portalEntrada.posX + margenColisionPortal &&
        naveY + margenColisionPortal < portalEntrada.posY + portalEntrada.alto - margenColisionPortal &&
        naveY + altoNave - margenColisionPortal > portalEntrada.posY + margenColisionPortal
    ) {
        // Teletransportar la nave al portal de salida
        naveX = portalSalida.posX;
        naveY = portalSalida.posY;
    }

    //Comprobar colisión con la base
    const baseX = anchoCanvas - anchoBase;
    const baseY = altoCanvas - altoBase;

    if (
        naveX < baseX + anchoBase &&
        naveX + anchoNave > baseX &&  
        naveY < baseY + altoBase &&
        naveY + altoNave > baseY      
    ) {
        mensajeFinalWin();
        nave.src = "./images/astronauta.png";
        finalizar("🏁 Has llegado a la base.");
        return;
    }

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


//Reiniciar el juego
function reiniciarJuego() {
    // Detener temporizador y el cambio de asteroides
    clearTimeout(stop);
    if (intervalAsteroides) {  
        clearInterval(intervalAsteroides);
        intervalAsteroides = null;  // Resetear la variable si existe el intervalo
    }
    
    // Quitar el evento del teclado por si acaso
    window.removeEventListener('keydown', moverNave, true);

    // Reiniciar variables
    naveX = 0;
    naveY = 0;
    contador = contadorInicial;
    tiempo = new Date(tiempoInicial);
    asteroides = [];

    // Limpiar el canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Reiniciar texto y colores del marcador
    document.getElementById("puntuacion").innerHTML = contador;
    document.getElementById("puntuacion").style.color = "";
    document.getElementById("mensaje").innerHTML = "Esquiva los asteroides y alcanza la base antes de quedarte sin tiempo... ¡y sin energía!";
    document.getElementById("tiempo").style.color = "";

    //Ocultar el botón de reiniciar con hidden true
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
    // Limpiar el intervalo anterior si existe
    if (intervalAsteroides) {
        clearInterval(intervalAsteroides);
    }
    
    intervalAsteroides = setInterval(() => {
        // Limpiar la zona donde estaban los asteroides anteriores
        for (let asteroide of asteroides) {
            limpiarZona(
                asteroide.posX - margenBorrado,
                asteroide.posY - margenBorrado,
                asteroide.ancho + (margenBorrado * 2),
                asteroide.alto + (margenBorrado * 2)
            );
        }

        // Redibujar todos los elementos
        dibujarBase();
        dibujarPortales();
        dibujarReloj();
        dibujarEnergia();
        dibujarNave();
        
        // Esperar un momento para que el canvas se "limpie" y dibujar nuevos asteroides
        setTimeout(() => {
            asteroides = [];
            pintarAsteroides();
        }, 50);
    }, velocidadAsteroides);
}