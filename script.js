const botonAgregar = document.getElementById("agregar-gasto");
const formulario = document.getElementById("formulario-gasto");
const botonCancelar = document.getElementById("cancelar-gasto");
const botonGuardar = document.getElementById("guardar-gasto");

//inputs recibidos para el registro
const categoria = document.getElementById("categoria");
const descripcion = document.getElementById("descripcion");
const monto = document.getElementById("monto");
const mensajeError = document.getElementById("mensaje-error");

const ordenSelect = document.getElementById("orden-select");
const inputBusqueda = document.getElementById("busqueda-input");
const filtroCategoria = document.getElementById("categoria-select");

let editandoIndex = null; // variable para almacenar el índice del gasto que se está editando

botonAgregar.addEventListener("click", function () {
  formulario.style.display = "block";
  document.body.style.overflow = "hidden";
});

botonCancelar.addEventListener("click", function () {
  mensajeError.textContent = "";
  categoria.value = "";
  descripcion.value = "";
  monto.value = "";
  formulario.style.display = "none";
  editandoIndex = null; // resetear el índice de edición al cancelar
  document.querySelector("#formulario-gasto h2").textContent =
    "Registrar Gasto"; //reiniciar titulo
});

botonGuardar.addEventListener("click", function () {
  const valorCategoria = categoria.value;
  const valorDescripcion = descripcion.value;
  const valorMonto = Number(monto.value);
  document.querySelector("#formulario-gasto h2").textContent =
    "Registrar Gasto"; //reiniciar titulo

  if (valorCategoria === "") {
    mensajeError.textContent = "Seleccione una categoría";
    return;
  }

  if (valorDescripcion === "") {
    mensajeError.textContent = "Ingrese una descripción";
    return;
  }

  if (isNaN(valorMonto)) {
    mensajeError.textContent = "Ingrese el monto";
    return;
  }

  if (valorMonto <= 0) {
    mensajeError.textContent = "Ingrese un monto mayor a cero";
    return;
  }
  mensajeError.textContent = "";
  // a guardar en el localStorage
  const fechaActual = new Date().toISOString().split("T")[0];
  //crear el gasto
  const gasto = {
    categoria: valorCategoria,
    descripcion: valorDescripcion,
    monto: valorMonto,
    fecha: fechaActual,
  };
  // obtener los gastos existentes
  let gastos = JSON.parse(localStorage.getItem("gastos")) || [];
  //agregar el nuevo gasto al array en caso de que sea nuevo registro o editar el gasto existente
  if (editandoIndex !== null) {
    gastos = gastos.map((g) =>
        //spread operator (copie el primero y luego ponga lo del segundo, priorizando lo del segundo)
      g.id === editandoIndex ? { ...g, ...gasto } : g,
    );
    editandoIndex = null;
  } else {
    gasto.id = Date.now(); // ID único
    gastos.push(gasto);
  }
  //pasar a string para guardar en el localStorage
  localStorage.setItem("gastos", JSON.stringify(gastos));
  //mostrar los gastos actualizados
  mostrarGastos();
  //mensajito
  alert("Registro exitoso");
  //limpiar
  categoria.value = "";
  descripcion.value = "";
  monto.value = "";
  formulario.style.display = "none";
});

const mostrarGastos = () => {
  //limpiar la lista antes de mostrar los gastos
  const lista = document.getElementById("lista-gastos");
  lista.innerHTML = "";
  // obtener los gastos del localStorage
  let gastos = JSON.parse(localStorage.getItem("gastos")) || [];

// 🔹 filtro categoría
const categoriaSeleccionada = filtroCategoria.value;
if (categoriaSeleccionada !== "todo") {
  gastos = gastos.filter(
    (gasto) => gasto.categoria === categoriaSeleccionada
  );
}

// 🔹 filtro búsqueda
const textoBusqueda = inputBusqueda.value.toLowerCase().trim();
if (textoBusqueda !== "") {
  gastos = gastos.filter((gasto) =>
    gasto.descripcion.toLowerCase().includes(textoBusqueda)
  );
}

// filtro monto
const tipoOrden = ordenSelect.value;
let gastosOrdenados = [...gastos];


if (tipoOrden === "monto-mayor") {
  gastosOrdenados.sort((a, b) => b.monto - a.monto);
} else if (tipoOrden === "monto-menor") {
  gastosOrdenados.sort((a, b) => a.monto - b.monto);
}

// 🔹 validar después de TODO
if (gastosOrdenados.length === 0) {
  if (textoBusqueda !== "") {
    lista.innerHTML = "<p>No hay gastos con esa descripción</p>";
  } else if (categoriaSeleccionada !== "todo") {
    lista.innerHTML = "<p>No hay gastos con esta categoría</p>";
  } else {
    lista.innerHTML = "<p>No hay gastos registrados</p>";
  }
  return;
}
  // recorrer los gastos y mostrarlos en la lista
  gastosOrdenados.forEach((gasto, index) => {
    // crear una fila para cada gasto
    const fila = document.createElement("div");
    // agregar clase para estilos
    fila.classList.add("fila");
    // llenar la fila con los datos del gasto
    fila.innerHTML = `
      <div class="col">${gasto.categoria}</div>
      <div class="col">${gasto.descripcion}</div>
      <div class="col">$${gasto.monto.toLocaleString()}</div>
      <div class="col">${gasto.fecha}</div>
      <div class="col">
      <button onclick="editarGasto(${gasto.id})">Editar</button> 
      <button onclick="eliminarGasto(${gasto.id})">Eliminar</button></div>
    `;
    // agregar la fila a la lista
    lista.appendChild(fila);
  });
};
const eliminarGasto = (id) => {
  if (!confirm("¿Seguro que quieres eliminar este gasto?")) {
    return;
  }
  let gastos = JSON.parse(localStorage.getItem("gastos")) || [];

  // reemplaza el array de gastos por uno nuevo que no incluya el gasto con el ID dado
  gastos = gastos.filter((gasto) => gasto.id !== id);

  // guardar de nuevo
  localStorage.setItem("gastos", JSON.stringify(gastos));
  alert("Gasto eliminado correctamente");
  // volver a pintar
  mostrarGastos();
};
const editarGasto = (id) => {
  document.querySelector("#formulario-gasto h2").textContent = "Editar Gasto";
  let gastos = JSON.parse(localStorage.getItem("gastos")) || [];
  // encontrar el gasto a editar por su ID
  const gasto = gastos.find((g) => g.id === id);

  // llenar el formulario
  categoria.value = gasto.categoria;
  descripcion.value = gasto.descripcion;
  monto.value = gasto.monto;

  // activar modo edición
  editandoIndex = id;

  // mostrar formulario
  formulario.style.display = "block";
};


        //eventos de fitrado
filtroCategoria.addEventListener("change", function () {
  mostrarGastos();
}); // mostrar gastos al cargar la página
inputBusqueda.addEventListener("input", function () {
  mostrarGastos();
});
ordenSelect.addEventListener("change", mostrarGastos);
mostrarGastos();
