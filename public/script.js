// ── URL base de la API ───────────────────────────────────
const API = 'http://localhost:3000/api/estudiantes';

// ── Referencias del DOM ──────────────────────────────────
const campos = {
  nombre: document.getElementById('nombre'),
  apellido: document.getElementById('apellido'),
  matricula: document.getElementById('matricula'),
  email: document.getElementById('email'),
  carrera: document.getElementById('carrera'),
  semestre: document.getElementById('semestre')
};

const editId = document.getElementById('edit-id');
const btnGuardar = document.getElementById('btn-guardar');
const btnCancelar = document.getElementById('btn-cancelar');
const formTitulo = document.getElementById('form-titulo');
const alertaEl = document.getElementById('alerta');
const tablaContainer = document.getElementById('tabla-container');
const contadorEl = document.getElementById('contador');
const modal = document.getElementById('modal');
const btnConfirmar = document.getElementById('btn-confirmar');
const btnModalCancel = document.getElementById('btn-modal-cancelar');

let idParaEliminar = null;

// ══════════════════════════════════════════════════════════
// READ — Cargar estudiantes
// ══════════════════════════════════════════════════════════
async function cargarEstudiantes() {
  try {

    const resp = await fetch(API);
    const data = await resp.json();

    contadorEl.textContent = `${data.total} registros`;

    if (data.datos.length === 0) {
      tablaContainer.innerHTML =
        '<p class="sin-datos">No hay estudiantes registrados aún.</p>';
      return;
    }

    let html = `
      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Matrícula</th>
            <th>Email</th>
            <th>Carrera</th>
            <th>Semestre</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
    `;

    data.datos.forEach(e => {

      html += `
        <tr>
          <td>${e.nombre} ${e.apellido}</td>
          <td>${e.matricula}</td>
          <td>${e.email}</td>
          <td>${e.carrera}</td>
          <td>${e.semestre}</td>
          <td>

            <button onclick="prepararEdicion(
              '${e._id}',
              '${e.nombre}',
              '${e.apellido}',
              '${e.matricula}',
              '${e.email}',
              '${e.carrera}',
              '${e.semestre}'
            )">
              Editar
            </button>

            <button onclick="pedirEliminar('${e._id}')">
              Eliminar
            </button>

          </td>
        </tr>
      `;
    });

    html += `
        </tbody>
      </table>
    `;

    tablaContainer.innerHTML = html;

  } catch (error) {

    mostrarAlerta('❌ Error al cargar estudiantes', 'error');
    console.error(error);

  }
}

// ══════════════════════════════════════════════════════════
// CREATE / UPDATE
// ══════════════════════════════════════════════════════════
btnGuardar.addEventListener('click', async () => {

  const datos = {
    nombre: campos.nombre.value.trim(),
    apellido: campos.apellido.value.trim(),
    matricula: campos.matricula.value.trim(),
    email: campos.email.value.trim(),
    carrera: campos.carrera.value.trim(),
    semestre: Number(campos.semestre.value)
  };

  if (!datos.nombre || !datos.matricula || !datos.email) {

    mostrarAlerta(
      '⚠️ Nombre, matrícula y email son obligatorios',
      'error'
    );

    return;
  }

  const esEdicion = editId.value !== '';

  const url = esEdicion
    ? `${API}/${editId.value}`
    : API;

  const metodo = esEdicion
    ? 'PUT'
    : 'POST';

  try {

    const resp = await fetch(url, {
      method: metodo,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(datos)
    });

    const data = await resp.json();

    if (!data.ok) {
      throw new Error(data.error);
    }

    mostrarAlerta(
      esEdicion
        ? '✅ Estudiante actualizado'
        : '✅ Estudiante agregado',
      'exito'
    );

    limpiarFormulario();
    cargarEstudiantes();

  } catch (error) {

    mostrarAlerta(`❌ ${error.message}`, 'error');

  }
});

// ══════════════════════════════════════════════════════════
// EDITAR
// ══════════════════════════════════════════════════════════
function prepararEdicion(
  id,
  nombre,
  apellido,
  matricula,
  email,
  carrera,
  semestre
) {

  editId.value = id;

  campos.nombre.value = nombre;
  campos.apellido.value = apellido;
  campos.matricula.value = matricula;
  campos.email.value = email;
  campos.carrera.value = carrera;
  campos.semestre.value = semestre;

  formTitulo.textContent = '✏️ Editando estudiante';

  btnCancelar.classList.remove('oculto');

  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
}

// ══════════════════════════════════════════════════════════
// ELIMINAR
// ══════════════════════════════════════════════════════════
function pedirEliminar(id) {

  idParaEliminar = id;

  modal.classList.remove('oculto');
}

btnConfirmar.addEventListener('click', async () => {

  try {

    const resp = await fetch(`${API}/${idParaEliminar}`, {
      method: 'DELETE'
    });

    const data = await resp.json();

    if (!data.ok) {
      throw new Error(data.error);
    }

    modal.classList.add('oculto');

    mostrarAlerta(
      '🗑 Estudiante eliminado correctamente',
      'exito'
    );

    cargarEstudiantes();

  } catch (error) {

    mostrarAlerta(
      '❌ Error al eliminar',
      'error'
    );

  }
});

// ══════════════════════════════════════════════════════════
// AUXILIARES
// ══════════════════════════════════════════════════════════
btnCancelar.addEventListener('click', limpiarFormulario);

btnModalCancel.addEventListener('click', () => {
  modal.classList.add('oculto');
});

function limpiarFormulario() {

  Object.values(campos).forEach(campo => {
    campo.value = '';
  });

  editId.value = '';

  formTitulo.textContent = '➕ Nuevo estudiante';

  btnCancelar.classList.add('oculto');
}

function mostrarAlerta(mensaje, tipo) {

  alertaEl.textContent = mensaje;

  alertaEl.className = `alerta ${tipo}`;

  setTimeout(() => {
    alertaEl.className = 'alerta oculto';
  }, 4000);
}

// ── Iniciar ───────────────────────────────────────────────
cargarEstudiantes();