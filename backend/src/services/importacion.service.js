const ExcelJS = require("exceljs");
const path = require("path");
const db = require("../db/database");
const bcrypt = require("bcrypt");

// Definición de columnas exactas requeridas por tabla
const ESTRUCTURA_REQUERIDA = {
    portatiles: ["marca", "tipo", "modelo", "num_serie", "ubicacion", "descripcion"],
    usuarios: ["nombre", "correo", "rol", "password"],
    ambientes: ["nombre", "direccion"]
};

const validarColumnas = (hoja, columnasEsperadas) => {
    const filaCabecera = hoja.getRow(1);
    const columnasArchivo = [];
    
    filaCabecera.eachCell((cell) => {
        if (cell.value) columnasArchivo.push(cell.value.toString().toLowerCase().trim());
    });

    const faltantes = columnasEsperadas.filter(col => !columnasArchivo.includes(col.toLowerCase()));
    
    if (faltantes.length > 0) {
        throw new Error(`Estructura inválida. Faltan las columnas: [${faltantes.join(", ")}]`);
    }
};

const leerArchivo = async (rutaArchivo) => {
    const ext = path.extname(rutaArchivo).toLowerCase();
    const workbook = new ExcelJS.Workbook();
    if (ext === ".xlsx") await workbook.xlsx.readFile(rutaArchivo);
    else if (ext === ".csv") await workbook.csv.readFile(rutaArchivo);
    else throw new Error("Formato no soportado");
    return workbook.getWorksheet(1);
};

const importarPortatiles = async (ruta) => {
    const hoja = await leerArchivo(ruta);
    validarColumnas(hoja, ESTRUCTURA_REQUERIDA.portatiles);

    let insertados = 0, errores = [];
    for (let i = 2; i <= hoja.rowCount; i++) {
        const fila = hoja.getRow(i);
        if (!fila.hasValues) continue;
        try {
            const [marca, tipo, modelo, serie, ubicacion, desc] = [1,2,3,4,5,6].map(n => fila.getCell(n).value?.toString().trim());
            if (!marca || !serie) throw new Error("Faltan datos críticos (Marca/Serial)");
            
            await db.query("INSERT INTO portatil (marca, tipo, modelo, estado, num_serie, ubicacion, descripcion) VALUES (?,?,?,?,?,?,?)",
                [marca, tipo, modelo, "Disponible", serie, ubicacion, desc || "Sin descripción"]);
            insertados++;
        } catch (e) { errores.push({ fila: i, error: e.message }); }
    }
    return { insertados, errores };
};

const importarUsuarios = async (ruta) => {
    const hoja = await leerArchivo(ruta);
    validarColumnas(hoja, ESTRUCTURA_REQUERIDA.usuarios);

    let insertados = 0, errores = [];
    for (let i = 2; i <= hoja.rowCount; i++) {
        const fila = hoja.getRow(i);
        if (!fila.hasValues) continue;
        try {
            const [nombre, correo, rol, password] = [1,2,3,4].map(n => fila.getCell(n).value?.toString().trim());
            if (!correo || !password) throw new Error("Correo y Password requeridos");
            
            const hash = await bcrypt.hash(password, 10);
            await db.query("INSERT INTO usuario (nombre, correo, rol, estado, password_hash) VALUES (?,?,?,?,?)",
                [nombre, correo, rol, "activo", hash]);
            insertados++;
        } catch (e) { errores.push({ fila: i, error: e.message }); }
    }
    return { insertados, errores };
};

const importarAmbientes = async (ruta) => {
    const hoja = await leerArchivo(ruta);
    validarColumnas(hoja, ESTRUCTURA_REQUERIDA.ambientes);

    let insertados = 0, errores = [];
    for (let i = 2; i <= hoja.rowCount; i++) {
        const fila = hoja.getRow(i);
        if (!fila.hasValues) continue;
        try {
            const [nombre, direccion] = [1,2].map(n => fila.getCell(n).value?.toString().trim());
            if (!direccion) throw new Error("Dirección requerida");
            
            await db.query("INSERT INTO ambiente (nombre, direccion) VALUES (?,?)", [nombre, direccion]);
            insertados++;
        } catch (e) { errores.push({ fila: i, error: e.message }); }
    }
    return { insertados, errores };
};

module.exports = { importarPortatiles, importarUsuarios, importarAmbientes };