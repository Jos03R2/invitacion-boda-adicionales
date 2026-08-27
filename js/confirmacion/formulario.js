/*======================================
        VARIABLES
======================================*/

const resultadoBusqueda =
document.getElementById("resultadoBusqueda");

const SCRIPT_URL =
"https://script.google.com/macros/s/AKfycbz_wOGILnq8wL08AHAWhQMfddxvpv7Domy1g3sQ7r_u5xP2efQ3OIFcX8730IooWEpj/exec";

let familiaActual = null;

/*======================================
        OBTENER CODIGO
======================================*/

function obtenerCodigo(){

    const parametros =
    new URLSearchParams(
        window.location.search
    );

    return parametros.get("codigo");

}

/*======================================
        CARGAR FAMILIA
======================================*/

function cargarFamilia(){

    const codigo =
    obtenerCodigo();

    resultadoBusqueda.innerHTML = "";

    if(!codigo){

        resultadoBusqueda.innerHTML = `

            <p style="text-align:center;">

                No se encontró el código de invitación.

            </p>

        `;

        return;

    }

    familiaActual =
    familias[codigo];

    if(!familiaActual){

        resultadoBusqueda.innerHTML = `

            <p style="text-align:center;">

                Código de invitación inválido.

            </p>

        `;

        return;

    }

    let html = `

        <form id="confirmacionForm">

            <div class="confirmacion__familia">

                <h3>

                    ${familiaActual.familia}

                </h3>

                <p class="confirmacion__descripcion-familia">

                    Nos llena de alegría compartir este momento tan especial con ustedes.

                </p>

                <p class="confirmacion__ayuda">

                    Marca o desmarca cada integrante para indicarnos quién podrá acompañarnos en este día tan especial.

                </p>

            </div>

            <div class="confirmacion__opciones">

    `;

    familiaActual.integrantes.forEach((nombre,index)=>{

        html += `

            <label class="confirmacion__opcion">

                <input

                    type="checkbox"

                    class="guest-checkbox"

                    checked

                    data-index="${index}">

                <span>

                    ${nombre}

                </span>

            </label>

        `;

    });

    html += `

            </div>

            <div class="confirmacion__mensaje">

                <label>

                    Déjanos un mensaje

                </label>

                <div class="emoji-container">

                    <button type="button" class="emoji-btn">❤️</button>

                    <button type="button" class="emoji-btn">🥰</button>

                    <button type="button" class="emoji-btn">🎉</button>

                    <button type="button" class="emoji-btn">🥂</button>

                    <button type="button" class="emoji-btn">💍</button>

                    <button type="button" class="emoji-btn">✨</button>

                    <button type="button" class="emoji-btn">😊</button>

                    <button type="button" class="emoji-btn">🙏</button>

                </div>

                <textarea

                    id="mensaje"

                    placeholder="Dedícanos unas palabras, un consejo o un lindo deseo para comenzar esta nueva etapa juntos... ❤️"

                ></textarea>

            </div>

            <button

                type="submit"

                class="confirmacion__enviar"

                id="btnConfirmar">

                <i class="fa-solid fa-heart"></i>

                Confirmar Asistencia

            </button>

        </form>

    `;

    resultadoBusqueda.innerHTML = html;

    iniciarFormulario();

    iniciarEmojis();

}

/*======================================
        EMOJIS
======================================*/

function iniciarEmojis(){

    const botones =

    document.querySelectorAll(

        ".emoji-btn"

    );

    const mensaje =

    document.getElementById(

        "mensaje"

    );

    botones.forEach(boton=>{

        boton.addEventListener(

            "click",

            ()=>{

                mensaje.value +=

                boton.textContent + " ";

            }

        );

    });

}

/*======================================
        FORMULARIO
======================================*/

function iniciarFormulario(){

    const formulario =

    document.getElementById(

        "confirmacionForm"

    );

    const boton =

    document.getElementById(

        "btnConfirmar"

    );

    formulario.addEventListener(

        "submit",

        async function(e){

            e.preventDefault();

            boton.disabled = true;

            boton.innerHTML = `

<i class="fa-solid fa-spinner fa-spin"></i>

Enviando...

`;

            const checkboxes =

            document.querySelectorAll(

                ".guest-checkbox"

            );

            const integrantes = [];

            let total = 0;

            checkboxes.forEach(

                (checkbox,index)=>{

                    const asiste =

                    checkbox.checked;

                    if(asiste){

                        total++;

                    }

                    integrantes.push({

                        nombre:

                        familiaActual.integrantes[index],

                        asiste:

                        asiste

                    });

                }

            );

           const datos = {

    grupo: "adicionales",

    codigo:

    familiaActual.codigo,

    familia:

    familiaActual.familia,

    integrantes:

    integrantes,

    mensaje:

    document.getElementById(

        "mensaje"

    ).value,

    total:

    total

};

            try{

                const respuesta =

                await fetch(

                    SCRIPT_URL,

                    {

                        method:"POST",

                        headers:{

                            "Content-Type":

                            "text/plain;charset=utf-8"

                        },

                        body:

                        JSON.stringify(datos)

                    }

                );

                const resultado =

                await respuesta.json();

                console.log(resultado);

                if(resultado.ok){

                    mostrarSuccess(

`Tu asistencia ha sido confirmada correctamente.

Nos sentimos muy felices de compartir este día tan especial con ustedes.

¡Nos vemos en la boda! ❤️`

);

                    formulario.reset();

                    boton.disabled = false;

                    boton.innerHTML = `

                        <i class="fa-solid fa-heart"></i>

                        Confirmar Asistencia

                    `;

                    return;

                }

                if(resultado.duplicado){

                   mostrarSuccess(

`Esta invitación ya fue confirmada anteriormente.

Si necesitas realizar algún cambio en tu confirmación, por favor comunícate con los novios.

Muchas gracias por acompañarnos. ❤️`

);

                    boton.disabled = false;

                    boton.innerHTML = `

                        <i class="fa-solid fa-heart"></i>

                        Confirmar Asistencia

                    `;

                    return;

                }

                mostrarSuccess(

`No fue posible registrar tu confirmación.

Por favor intenta nuevamente dentro de unos minutos.

Si el problema continúa, comunícate con los novios.`

);

            }

            catch(error){

                console.error(error);

                mostrarSuccess(

`No fue posible conectar con el servidor.

Verifica tu conexión a Internet e inténtalo nuevamente.`

);

            }

            boton.disabled = false;

            boton.innerHTML = `

                <i class="fa-solid fa-heart"></i>

                Confirmar Asistencia

            `;

        }

    );

}

/*======================================
        INICIAR
======================================*/

document.addEventListener(

    "DOMContentLoaded",

    cargarFamilia

);