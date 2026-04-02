const ExcelJS = require("exceljs");
const db = require("../db/database");
const path = require("path");
const fs = require("fs");

const aplicarEstilosExcel = (hoja, filas) => {
    hoja.getRow(1).eachCell((cell) => {
        cell.font = { bold: true, size: 12, color: { argb: "FFFFFFFF" } };
        cell.alignment = { vertical: "middle", horizontal: "center" };
        cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF1F4E78" } };
        cell.border = { top: { style: "thin" }, left: { style: "thin" }, bottom: { style: "thin" }, right: { style: "thin" } };
    });

    filas.forEach((item, index) => {
        const fila = hoja.addRow(item);
        fila.eachCell((cell) => {
            cell.alignment = { vertical: "middle", horizontal: "center" };
            cell.border = { style: "thin" };
        });
        if (index % 2 === 0) {
            fila.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFF2F2F2" } };
        }
    });
    hoja.columns.forEach(col => col.width = 20);
};

const exportarExcelGenerico = async (res, query, nombreHoja, columnas) => {
    try {
        const [rows] = await db.query(query);
        const workbook = new ExcelJS.Workbook();
        const hoja = workbook.addWorksheet(nombreHoja);
        hoja.columns = columnas;
        aplicarEstilosExcel(hoja, rows);

        const folderPath = path.join(__dirname, "../../temp");
        if (!fs.existsSync(folderPath)) fs.mkdirSync(folderPath, { recursive: true });
        
        const filePath = path.join(folderPath, `${nombreHoja.toLowerCase()}.xlsx`);
        await workbook.xlsx.writeFile(filePath);
        
        res.download(filePath, `${nombreHoja.toLowerCase()}.xlsx`, () => {
            if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        });
    } catch (error) {
        res.status(500).json({ error: "Error al exportar Excel" });
    }
};

const exportarCSVGenerico = async (res, query, nombreArchivo, columnas, encabezados) => {
    try {
        const [rows] = await db.query(query);
        let csv = "\uFEFF" + encabezados.join(",") + "\n";
        rows.forEach(row => {
            const fila = columnas.map(col => {
                let valor = row[col] != null ? row[col].toString() : "";
                valor = valor.replace(/"/g, '""');
                return (valor.includes(",") || valor.includes("\n")) ? `"${valor}"` : valor;
            }).join(",");
            csv += fila + "\n";
        });

        const folderPath = path.join(__dirname, "../../temp");
        if (!fs.existsSync(folderPath)) fs.mkdirSync(folderPath, { recursive: true });
        
        const filePath = path.join(folderPath, `${nombreArchivo}.csv`);
        fs.writeFileSync(filePath, csv, "utf8");
        res.download(filePath, `${nombreArchivo}.csv`, () => {
            if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        });
    } catch (error) {
        res.status(500).json({ error: "Error al exportar CSV" });
    }
};

// Exportadores específicos
const exportarPortatilesExcel = (req, res) => exportarExcelGenerico(res, "SELECT * FROM portatil", "Portatiles", [
    { header: "ID", key: "id_portatil" }, { header: "Marca", key: "marca" }, { header: "Tipo", key: "tipo" },
    { header: "Modelo", key: "modelo" }, { header: "Estado", key: "estado" }, { header: "Serial", key: "num_serie" },
    { header: "Ubicación", key: "ubicacion" }, { header: "Descripción", key: "descripcion" }
]);

const exportarPortatilesCSV = (req, res) => exportarCSVGenerico(res, "SELECT * FROM portatil", "portatiles", 
    ["id_portatil", "marca", "tipo", "modelo", "estado", "num_serie", "ubicacion", "descripcion"],
    ["ID", "Marca", "Tipo", "Modelo", "Estado", "Serial", "Ubicación", "Descripción"]
);

const exportarUsuariosExcel = (req, res) => exportarExcelGenerico(res, "SELECT id_usuario, nombre, correo, rol, estado FROM usuario", "Usuarios", [
    { header: "ID", key: "id_usuario" }, { header: "Nombre", key: "nombre" }, { header: "Correo", key: "correo" },
    { header: "Rol", key: "rol" }, { header: "Estado", key: "estado" }
]);

const exportarUsuariosCSV = (req, res) => exportarCSVGenerico(res, "SELECT id_usuario, nombre, correo, rol, estado FROM usuario", "usuarios",
    ["id_usuario", "nombre", "correo", "rol", "estado"],
    ["ID", "Nombre", "Correo", "Rol", "Estado"]
);

const exportarAmbientesExcel = (req, res) => exportarExcelGenerico(res, "SELECT * FROM ambiente", "Ambientes", [
    { header: "ID", key: "id_ambiente" }, { header: "Nombre", key: "nombre" }, { header: "Dirección", key: "direccion" }
]);

const exportarAmbientesCSV = (req, res) => exportarCSVGenerico(res, "SELECT * FROM ambiente", "ambientes",
    ["id_ambiente", "nombre", "direccion"],
    ["ID", "Nombre", "Dirección"]
);

const exportarFichasExcel = (req, res) => exportarExcelGenerico(res, "SELECT * FROM ficha", "Fichas", [
    { header: "ID",                 key: "id_ficha" },
    { header: "Nombre",             key: "nombre" },
    { header: "Programa Formacion", key: "programa_formacion" },
    { header: "Jornada",            key: "jornada" },
    { header: "ID Instructor",      key: "id_instructor" },
    { header: "Cupo Maximo",        key: "cupo_maximo" },
    { header: "Estado",             key: "estado" },
    { header: "Fecha Creacion",     key: "fecha_creacion" }
]);

module.exports = {
    exportarPortatilesExcel, exportarPortatilesCSV,
    exportarUsuariosExcel,   exportarUsuariosCSV,
    exportarAmbientesExcel,  exportarAmbientesCSV,
    exportarFichasExcel
};