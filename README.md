# 🚀 Space Stars by Javi García

Space Stars by Javi García es un minijuego arcade creado con HTML, CSS y JavaScript puro. Está basado en el juego Space Stars de Jairo García Rincón (https://www.jairogarciarincon.com/clase/videojuego-sencillo-con-html5).
Tu misión: guiar tu nave espacial hasta la base evitando asteroides y gestionando tu energía y tiempo.  

## Cómo jugar
-----------
- Mueve la nave con las flechas del teclado o WASD  
- Evita los asteroides  
- Coge el reloj para ganar tiempo y la batería para recuperar energía  
- Usa los portales para moverte rápido entre zonas  
- Si llegas a la base ganas.

## Controles
----------
⬆️ / W  → Mover arriba  
⬇️ / S  → Mover abajo  
⬅️ / A  → Mover izquierda  
➡️ / D  → Mover derecha  


## Mecánica general
----------------
- La energía baja en cada movimiento. Si llega a 0 → Game Over.  
- El tiempo comienza en 30 segundos. Si se acaba → Game Over.  
- Los asteroides cambian de posición cada pocos segundos.  
- Si chocas con uno, tu nave explota y pierdes.  
- Ganas si llegas a la base aún tienes energía o tiempo.


## Tecnologías utilizadas
----------------------
- HTML5 Canvas → Renderizado del juego  
- CSS3 → Estilos, fuentes y botones animados  
- JavaScript → Lógica principal, colisiones, movimiento, tiempo y energía  
- Google Fonts (Momo Signature y Sixtyfour)

## Lógica de dimensiones
---------------------
- Nave: 80 × 80 px  
- Movimiento: 40 px por tecla  
- Canvas: 1800 × 760 px  
  - La nave llega exactamente al borde tras 43 pasos horizontales y 17 pasos verticales.

## Próximas mejoras
----------------
- [ ] Sistema de puntuación global   
- [ ] Sonidos y música  
- [ ] Recoger astronauta perdido
- [ ] Pausa con tecla P

## Inicia el juego
----------------
Abre directamente en GitHub Pages: https://europons.github.io/spacestars/

## Autor
----------------
Javier García Pons
