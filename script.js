const botonAgregar = document.getElementById("agregar-gasto");
const formulario = document.getElementById("formulario-gasto");
const botonCancelar = document.getElementById("cancelar-gasto");
const botonGuardar = document.getElementById("guardar-gasto");

//inputs recibidos para el registro
const categoria = document.getElementById("categoria");
const descripcion = document.getElementById("descripcion");
const monto = document.getElementById("monto");
const mensajeError = document.getElementById("mensaje-error");

botonAgregar.addEventListener("click", function(){
    formulario.style.display = "block";
});

botonCancelar.addEventListener("click", function(){
    formulario.style.display = "none";
});


botonGuardar.addEventListener("click", function(){
    const valorCategoria = categoria.value;
    const valorDescripcion = descripcion.value;
    const valorMonto = parseInt(monto.value);

    if (valorCategoria === ""){
        mensajeError.innerHTML = "Seleccione una categoría";
        return;
    }

    if (valorDescripcion === ""){
        mensajeError.innerHTML = "Ingrese una descripción";
        return;
    }
    if(isNaN(valorMonto)){
        mensajeError.innerHTML = "Ingrese el monto";
        return;
    }
    if (valorMonto <= 0){
        mensajeError.innerHTML = "Ingrese un monto mayor a cero";
        return;
    }
    mensajeError.textContent = "";
    
});