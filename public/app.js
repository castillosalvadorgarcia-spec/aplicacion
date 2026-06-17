// ── Verificar carga ──────────────────────────────────────────
console.log("🚀 app.js cargado correctamente");

// ── Elementos del DOM ──────────────────────────────────────
const formulario = document.getElementById('formulario');
const contenedor = document.getElementById('contenedorProductos');
const buscador = document.querySelector('.search');
const cancelar = document.getElementById('cancelar');

// ── Configuración API ──────────────────────────────────────
const API = '/api/componentes';

// ── Cargar componentes ─────────────────────────────────────
async function cargarComponentes() {
    try {
        console.log('📥 Cargando componentes...');
        const respuesta = await fetch(API);
        
        if (!respuesta.ok) {
            throw new Error(`Error HTTP: ${respuesta.status}`);
        }
        
        const componentes = await respuesta.json();
        console.log(`✅ ${componentes.length} componentes cargados`);
        mostrarComponentes(componentes);
        
    } catch (error) {
        console.error('❌ Error al cargar componentes:', error);
        mostrarMensajeError('Error al cargar los componentes. Verifica que el servidor esté corriendo.');
    }
}

// ── Mostrar componentes ────────────────────────────────────
function mostrarComponentes(componentes) {
    contenedor.innerHTML = '';

    if (componentes.length === 0) {
        contenedor.innerHTML = `
            <div class="mensaje-vacio">
                <p>📦 No hay componentes registrados</p>
                <p style="font-size: 14px; color: #666;">Agrega tu primer componente usando el formulario</p>
            </div>
        `;
        return;
    }

    componentes.forEach(componente => {
        const card = document.createElement('div');
        card.classList.add('producto-card');

        // Manejar imagen por defecto si no carga
        const imagenSrc = componente.imagen || 'https://via.placeholder.com/200x150?text=Sin+Imagen';

        card.innerHTML = `
            <img 
                src="${imagenSrc}" 
                alt="${componente.nombre}"
                onerror="this.src='https://via.placeholder.com/200x150?text=Error+Imagen'"
            >
            <div class="producto-info">
                <h3>${componente.nombre}</h3>
                <p><strong>Marca:</strong> ${componente.marca}</p>
                <p><strong>Categoría:</strong> ${componente.categoria}</p>
                <p><strong>Precio:</strong> $${componente.precio}</p>
                <p><strong>Stock:</strong> ${componente.stock}</p>
                <div class="acciones">
                    <button class="editar" onclick="editarComponente('${componente._id}')">
                        ✏️ Editar
                    </button>
                    <button class="eliminar" onclick="eliminarComponente('${componente._id}')">
                        🗑️ Eliminar
                    </button>
                </div>
            </div>
        `;
        contenedor.appendChild(card);
    });
}

// ── Mostrar mensaje de error ──────────────────────────────
function mostrarMensajeError(mensaje) {
    contenedor.innerHTML = `
        <div class="mensaje-error">
            <p>❌ ${mensaje}</p>
            <button onclick="cargarComponentes()" style="margin-top: 10px; padding: 8px 16px; cursor: pointer;">
                🔄 Reintentar
            </button>
        </div>
    `;
}

// ── Guardar o actualizar componente ───────────────────────
formulario.addEventListener('submit', async (e) => {
    e.preventDefault();

    const id = document.getElementById('componenteId').value;
    const botonSubmit = formulario.querySelector('button[type="submit"]');
    
    // Deshabilitar botón para evitar doble envío
    botonSubmit.disabled = true;
    botonSubmit.textContent = '⏳ Guardando...';

    // Obtener datos del formulario
    const componente = {
        nombre: document.getElementById('nombre').value.trim(),
        marca: document.getElementById('marca').value.trim(),
        categoria: document.getElementById('categoria').value,
        precio: parseFloat(document.getElementById('precio').value),
        stock: parseInt(document.getElementById('stock').value),
        imagen: document.getElementById('imagen').value.trim()
    };

    // Validación básica
    if (!componente.nombre || !componente.marca || !componente.categoria) {
        alert('⚠️ Por favor completa todos los campos obligatorios');
        botonSubmit.disabled = false;
        botonSubmit.textContent = 'Guardar Componente';
        return;
    }

    console.log('📤 Enviando datos:', componente);

    try {
        let respuesta;
        let url = API;
        let metodo = 'POST';

        if (id) {
            url = `${API}/${id}`;
            metodo = 'PUT';
            console.log(`✏️ Actualizando componente ID: ${id}`);
        } else {
            console.log('➕ Creando nuevo componente');
        }

        respuesta = await fetch(url, {
            method: metodo,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(componente)
        });

        const resultado = await respuesta.json();
        console.log('📥 Respuesta del servidor:', resultado);

        if (!respuesta.ok) {
            throw new Error(resultado.error || `Error ${respuesta.status}: ${respuesta.statusText}`);
        }

        // Éxito
        console.log('✅ Componente guardado correctamente');
        formulario.reset();
        document.getElementById('componenteId').value = '';
        await cargarComponentes();
        
        // Mostrar mensaje de éxito
        mostrarMensajeExito(id ? 'Componente actualizado ✅' : 'Componente creado ✅');

    } catch (error) {
        console.error('❌ Error al guardar:', error);
        alert(`❌ Error: ${error.message}`);
    } finally {
        // Rehabilitar botón
        botonSubmit.disabled = false;
        botonSubmit.textContent = 'Guardar Componente';
    }
});

// ── Mostrar mensaje de éxito temporal ─────────────────────
function mostrarMensajeExito(mensaje) {
    const mensajeDiv = document.createElement('div');
    mensajeDiv.className = 'mensaje-exito';
    mensajeDiv.textContent = mensaje;
    mensajeDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #4CAF50;
        color: white;
        padding: 15px 25px;
        border-radius: 8px;
        box-shadow: 0 4px 8px rgba(0,0,0,0.2);
        z-index: 1000;
        animation: slideIn 0.3s ease;
    `;
    document.body.appendChild(mensajeDiv);
    
    setTimeout(() => {
        mensajeDiv.style.opacity = '0';
        mensajeDiv.style.transition = 'opacity 0.3s';
        setTimeout(() => mensajeDiv.remove(), 300);
    }, 3000);
}

// ── Editar componente ──────────────────────────────────────
async function editarComponente(id) {
    try {
        console.log(`✏️ Editando componente ID: ${id}`);
        const respuesta = await fetch(`${API}/${id}`);
        
        if (!respuesta.ok) {
            throw new Error(`Error HTTP: ${respuesta.status}`);
        }
        
        const componente = await respuesta.json();
        console.log('📥 Datos del componente:', componente);

        document.getElementById('componenteId').value = componente._id;
        document.getElementById('nombre').value = componente.nombre;
        document.getElementById('marca').value = componente.marca;
        document.getElementById('categoria').value = componente.categoria;
        document.getElementById('precio').value = componente.precio;
        document.getElementById('stock').value = componente.stock;
        document.getElementById('imagen').value = componente.imagen;

        // Cambiar texto del botón
        const botonSubmit = formulario.querySelector('button[type="submit"]');
        botonSubmit.textContent = '✏️ Actualizar Componente';

        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });

    } catch (error) {
        console.error('❌ Error al cargar componente para editar:', error);
        alert('Error al cargar los datos del componente');
    }
}

// ── Eliminar componente ────────────────────────────────────
async function eliminarComponente(id) {
    const confirmar = confirm('⚠️ ¿Estás seguro de que deseas eliminar este componente?');
    
    if (!confirmar) return;

    try {
        console.log(`🗑️ Eliminando componente ID: ${id}`);
        const respuesta = await fetch(`${API}/${id}`, {
            method: 'DELETE'
        });

        if (!respuesta.ok) {
            const error = await respuesta.json();
            throw new Error(error.error || `Error ${respuesta.status}`);
        }

        console.log('✅ Componente eliminado');
        await cargarComponentes();
        mostrarMensajeExito('Componente eliminado 🗑️');

    } catch (error) {
        console.error('❌ Error al eliminar:', error);
        alert(`Error al eliminar: ${error.message}`);
    }
}

// ── Cancelar edición ──────────────────────────────────────
cancelar.addEventListener('click', () => {
    formulario.reset();
    document.getElementById('componenteId').value = '';
    
    // Restaurar texto del botón
    const botonSubmit = formulario.querySelector('button[type="submit"]');
    botonSubmit.textContent = 'Guardar Componente';
    
    console.log('🔄 Edición cancelada');
});

// ── Buscador ──────────────────────────────────────────────
buscador.addEventListener('input', async (e) => {
    const texto = e.target.value.toLowerCase().trim();
    console.log(`🔍 Buscando: "${texto}"`);

    if (texto === '') {
        cargarComponentes();
        return;
    }

    try {
        const respuesta = await fetch(API);
        const componentes = await respuesta.json();
        
        const filtrados = componentes.filter(c => 
            c.nombre.toLowerCase().includes(texto) ||
            c.marca.toLowerCase().includes(texto) ||
            c.categoria.toLowerCase().includes(texto)
        );
        
        console.log(`🔍 ${filtrados.length} resultados encontrados`);
        mostrarComponentes(filtrados);
        
    } catch (error) {
        console.error('❌ Error en búsqueda:', error);
    }
});

// ── Iniciar aplicación ────────────────────────────────────
console.log('🔄 Iniciando aplicación...');
cargarComponentes();

// ── Estilos dinámicos para mensajes ──────────────────────
// Agregar estilos para mensajes de éxito/error
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    .mensaje-vacio {
        grid-column: 1 / -1;
        text-align: center;
        padding: 50px 20px;
        background: #f9f9f9;
        border-radius: 10px;
        font-size: 18px;
    }
    
    .mensaje-error {
        grid-column: 1 / -1;
        text-align: center;
        padding: 30px 20px;
        background: #ffebee;
        border: 1px solid #ffcdd2;
        border-radius: 10px;
        color: #c62828;
    }
    
    .mensaje-exito {
        position: fixed;
        top: 20px;
        right: 20px;
        background: #4CAF50;
        color: white;
        padding: 15px 25px;
        border-radius: 8px;
        box-shadow: 0 4px 8px rgba(0,0,0,0.2);
        z-index: 1000;
        animation: slideIn 0.3s ease;
    }
`;
document.head.appendChild(style);

console.log('✅ app.js listo');