const validateErrors = (req) => {
  const { nombre, descripcion, categoria, talla, precio } = req.body;
  const errors = [];

  if (!nombre || nombre.trim() === "")
    errors.push("El nombre del producto es obligatorio.");
  if (!descripcion || descripcion.trim() === "")
    errors.push("La descripción es obligatoria.");
  if (!categoria || categoria.trim() === "")
    errors.push("La categoría es obligatoria.");
  if (!talla || talla.trim() === "") errors.push("La talla es obligatoria.");
  if (!precio || isNaN(precio) || Number(precio) <= 0)
    errors.push("El precio debe ser un número mayor que 0.");
  if (!req.file) errors.push("Debes subir una imagen del producto.");

  return errors;
};

module.exports = validateErrors;
