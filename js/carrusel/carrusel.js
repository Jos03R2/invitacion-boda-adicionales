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

const slides =
Array.from(

document.querySelectorAll(

".carrusel__slide"

)

);

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
        VARIABLES
======================================*/

let indice = 0;

let autoplay;

let permitida = true;

/*======================================
        DOTS
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

            if(i===indice)return;

            indice=i;

            mover();

            reiniciarAutoplay();

        }

    );

    dotsContainer.appendChild(dot);

}

const dots =
document.querySelectorAll(

".carrusel__dot"

);

/*======================================
        CONTADOR
======================================*/

function actualizarContador(){

    contador.textContent=

    `${String(indice+1).padStart(2,"0")} / ${String(totalSlides).padStart(2,"0")}`;

}

/*======================================
        DOTS
======================================*/

function actualizarDots(){

    dots.forEach(

        dot=>

        dot.classList.remove(

            "activo"

        )

    );

    dots[indice]

    .classList.add(

        "activo"

    );

}

/*======================================
        SLIDE ACTIVO
======================================*/

function actualizarSlides(){

    slides.forEach(

        slide=>

        slide.classList.remove(

            "activo"

        )

    );

    slides[indice]

    .classList.add(

        "activo"

    );

}

/*======================================
        MOVER
======================================*/

function mover(){

    if(!permitida)return;

    permitida=false;

    track.style.transition=

    "transform .9s cubic-bezier(.65,.05,.36,1)";

    track.style.transform=

    `translateX(-${indice*100}%)`;

    actualizarDots();

    actualizarContador();

    actualizarSlides();

    setTimeout(

        ()=>{

            permitida=true;

        },

        900

    );

}

/*======================================
        ESTADO INICIAL
======================================*/

track.style.transform=

`translateX(0%)`;

actualizarDots();

actualizarContador();

actualizarSlides();

/*======================================
        SIGUIENTE
======================================*/

function siguiente(){

    if(!permitida)return;

    indice++;

    if(indice>=totalSlides){

        indice=0;

    }

    mover();

}

/*======================================
        ANTERIOR
======================================*/

function anterior(){

    if(!permitida)return;

    indice--;

    if(indice<0){

        indice=totalSlides-1;

    }

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

    detenerAutoplay();

    autoplay=

    setInterval(

        ()=>{

            siguiente();

        },

        8000

    );

}

function detenerAutoplay(){

    clearInterval(

        autoplay

    );

}

function reiniciarAutoplay(){

    iniciarAutoplay();

}

/*======================================
        PAUSA MOUSE
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

let inicioX=0;

let finX=0;

track.addEventListener(

    "touchstart",

    e=>{

        inicioX=

        e.touches[0].clientX;

    },

    {

        passive:true

    }

);

track.addEventListener(

    "touchmove",

    e=>{

        finX=

        e.touches[0].clientX;

    },

    {

        passive:true

    }

);

track.addEventListener(

    "touchend",

    ()=>{

        const diferencia=

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
        REDIMENSIONAR
======================================*/

window.addEventListener(

    "resize",

    ()=>{

        track.style.transition=

        "none";

        track.style.transform=

        `translateX(-${indice*100}%)`;

    }

);

/*======================================
        INICIAR
======================================*/

iniciarAutoplay();