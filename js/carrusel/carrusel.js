/*======================================
        ELEMENTOS
======================================*/

const contenedor =
document.querySelector(".carrusel__contenedor");

const track =
document.querySelector(".carrusel__track");

const btnPrev =
document.querySelector(".carrusel__prev");

const btnNext =
document.querySelector(".carrusel__next");

const dotsContainer =
document.querySelector(".carrusel__dots");

/*======================================
        SLIDES
======================================*/

let slides =
Array.from(document.querySelectorAll(".carrusel__slide"));

const totalSlides =
slides.length;

/*======================================
        CONTADOR
======================================*/

const contador =
document.createElement("div");

contador.className =
"carrusel__contador";

contenedor.appendChild(contador);

/*======================================
        CLONES
======================================*/

const primerClon =
slides[0].cloneNode(true);

const ultimoClon =
slides[slides.length-1].cloneNode(true);

primerClon.id =
"primer-clon";

ultimoClon.id =
"ultimo-clon";

track.appendChild(primerClon);

track.insertBefore(

    ultimoClon,

    slides[0]

);

/*======================================
        NUEVOS SLIDES
======================================*/

slides =
Array.from(

track.querySelectorAll(".carrusel__slide")

);

/*======================================
        VARIABLES
======================================*/

let indice = 1;

let autoplay;

let permitida = true;

/*======================================
        POSICION INICIAL
======================================*/

track.style.transform =

`translateX(-${indice*100}%)`;

/*======================================
        CREAR DOTS
======================================*/

for(

let i=0;

i<totalSlides;

i++

){

    const dot =
    document.createElement("span");

    dot.className =
    "carrusel__dot";

    if(i===0){

        dot.classList.add("activo");

    }

    dot.addEventListener(

        "click",

        ()=>{

            indice =
            i+1;

            mover();

            reiniciarAutoplay();

        }

    );

    dotsContainer.appendChild(dot);

}

const dots =
document.querySelectorAll(".carrusel__dot");

/*======================================
        CONTADOR
======================================*/

function actualizarContador(){

    let numero =
    indice-1;

    if(numero<0){

        numero=
        totalSlides-1;

    }

    if(numero>=totalSlides){

        numero=0;

    }

    contador.textContent =

    `${String(numero+1).padStart(2,"0")} / ${String(totalSlides).padStart(2,"0")}`;

}

/*======================================
        DOTS
======================================*/

function actualizarDots(){

    dots.forEach(

        dot=>dot.classList.remove("activo")

    );

    let numero =
    indice-1;

    if(numero<0){

        numero=
        totalSlides-1;

    }

    if(numero>=totalSlides){

        numero=0;

    }

    dots[numero].classList.add("activo");

}

/*======================================
        MOVER
======================================*/

function mover(){

    if(!permitida)return;

    permitida=false;

    track.style.transition=
    "transform .65s ease-in-out";

    track.style.transform=

    `translateX(-${indice*100}%)`;

    actualizarDots();

    actualizarContador();

}

/*======================================
        TRANSICION
======================================*/

track.addEventListener(

    "transitionend",

    ()=>{

        const actual =
        slides[indice];

        if(

            actual.id===

            "primer-clon"

        ){

            track.style.transition=
            "none";

            indice=1;

            track.style.transform=

            `translateX(-${indice*100}%)`;

        }

        if(

            actual.id===

            "ultimo-clon"

        ){

            track.style.transition=
            "none";

            indice=
            totalSlides;

            track.style.transform=

            `translateX(-${indice*100}%)`;

        }

        slides.forEach(

            slide=>

            slide.classList.remove("activo")

        );

        slides[indice]

        .classList.add("activo");

        permitida=true;

    }

);

actualizarDots();

actualizarContador();

slides[indice]

.classList.add("activo");

/*======================================
        SIGUIENTE
======================================*/

function siguiente(){

    if(!permitida)return;

    indice++;

    mover();

}

/*======================================
        ANTERIOR
======================================*/

function anterior(){

    if(!permitida)return;

    indice--;

    mover();

}

/*======================================
        BOTONES
======================================*/

btnNext.addEventListener(

    "click",

    ()=>{

        siguiente();

        reiniciarAutoplay();

    }

);

btnPrev.addEventListener(

    "click",

    ()=>{

        anterior();

        reiniciarAutoplay();

    }

);

/*======================================
        AUTOPLAY
======================================*/

function iniciarAutoplay(){

    autoplay =

    setInterval(

        ()=>{

            siguiente();

        },

        5000

    );

}

function detenerAutoplay(){

    clearInterval(

        autoplay

    );

}

function reiniciarAutoplay(){

    detenerAutoplay();

    iniciarAutoplay();

}

/*======================================
        PAUSA AL PASAR EL MOUSE
======================================*/

contenedor.addEventListener(

    "mouseenter",

    detenerAutoplay

);

contenedor.addEventListener(

    "mouseleave",

    iniciarAutoplay

);

/*======================================
        SWIPE
======================================*/

let inicioX = 0;

let finX = 0;

track.addEventListener(

    "touchstart",

    e=>{

        inicioX =

        e.touches[0].clientX;

    },

    {

        passive:true

    }

);

track.addEventListener(

    "touchmove",

    e=>{

        finX =

        e.touches[0].clientX;

    },

    {

        passive:true

    }

);

track.addEventListener(

    "touchend",

    ()=>{

        const diferencia =

        inicioX-finX;

        if(

            Math.abs(

                diferencia

            )>50

        ){

            if(

                diferencia>0

            ){

                siguiente();

            }

            else{

                anterior();

            }

            reiniciarAutoplay();

        }

    }

);

/*======================================
        TECLADO
======================================*/

document.addEventListener(

    "keydown",

    e=>{

        if(

            e.key===

            "ArrowRight"

        ){

            siguiente();

            reiniciarAutoplay();

        }

        if(

            e.key===

            "ArrowLeft"

        ){

            anterior();

            reiniciarAutoplay();

        }

    }

);

/*======================================
        VISIBILIDAD
======================================*/

document.addEventListener(

    "visibilitychange",

    ()=>{

        if(

            document.hidden

        ){

            detenerAutoplay();

        }

        else{

            iniciarAutoplay();

        }

    }

);

/*======================================
        INICIAR
======================================*/

iniciarAutoplay();