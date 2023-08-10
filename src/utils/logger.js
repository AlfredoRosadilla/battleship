// Importamos el módulo de sistema de archivos de Node.js
const fs = require('fs');
const path = require('path');

const logsPath = path.join(`${__dirname}/../../`, 'logs');

// Definimos un enumerador para los niveles de log
const LogLevels = {
  INFO: 'info',
  WARNING: 'warning',
  ERROR: 'error',
};

const ConsoleLevels = {
  [LogLevels.INFO]: 'log',
  [LogLevels.ERROR]: 'error',
  [LogLevels.WARNING]: 'warning',
};

class Logger {
  constructor() {
    this.logsFolder = logsPath;

    // Creamos la carpeta de logs si no existe
    if (!fs.existsSync(this.logsFolder)) {
      fs.mkdirSync(this.logsFolder, { recursive: true });
    }
  }

  // Método para agregar un log
  addLog(log, level) {
    // Creamos un mensaje de log con la fecha y hora actuales
    const logMessage = `${new Date().toISOString()} - ${log}\n`;

    // Definimos el nombre del archivo de log
    const logFile = path.join(
      this.logsFolder,
      level,
      `${new Date().toISOString().split('T')[0]}.log`,
    );

    // Creamos la carpeta para el nivel de log si no existe
    const logFolder = path.dirname(logFile);
    if (!fs.existsSync(logFolder)) {
      fs.mkdirSync(logFolder, { recursive: true });
    }

    // Escribimos el mensaje de log en el archivo de log
    fs.appendFileSync(logFile, logMessage);

    // Mostramos el mensaje de log en la consola
    console[ConsoleLevels[level]](logMessage);
  }
}

// Exportamos el Logger y los LogLevels
module.exports = { Logger, LogLevels };
