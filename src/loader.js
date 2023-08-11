const fs = require('fs');

// Leer el archivo de imagen
fs.readFile(`${__dirname}/target.jpg`, (err, data) => {
  if (err) {
    console.error('Error al leer la imagen:', err);
    return;
  }

  // Convertir la imagen a base64
  const base64Image = data.toString('base64');

  // Guardar la cadena base64 en el archivo resultado.txt
  fs.writeFile('resultado.txt', base64Image, (err) => {
    if (err) {
      console.error('Error al guardar la imagen en base64:', err);
      return;
    }
    console.log('Imagen guardada en base64 en resultado.txt exitosamente.');
  });
});
