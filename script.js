const botonAgregar = document.getElementById("agregar-gasto");
const formulario = document.getElementById("formulario-gasto");
const botonCancelar = document.getElementById("cancelar-gasto");

botonAgregar.addEventListener("click", function(){
    formulario.style.display = "block";
});