const db = require("../db/database");
const { generarExcelReportes } = require("../services/excel.service");
const ExcelJS = require("exceljs");

const exportarReportesExcel = async (req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM reportes");

        const workbook = await generarExcelReportes(rows);

        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );

        res.setHeader(
            "Content-Disposition",
            "attachment; filename=reportes.xlsx"
        );

        await workbook.xlsx.write(res);
        res.end();

    } catch (error) {
        console.error(error);
        res.status(500).json({
            mensaje: "Error al exportar reportes",
            error
        });
    }
};

const importarReportesExcel = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ mensaje: "No se envió ningún archivo" });
        }

        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.load(req.file.buffer);

        const worksheet = workbook.worksheets[0]; // Primera hoja

        const reportes = [];

        worksheet.eachRow((row, rowNumber) => {
            if (rowNumber === 1) return; // Saltar encabezados

            const estado_reporte = row.getCell(1).value?.toString().trim();
            const fecha_reporte  = row.getCell(2).value;
            const descripcion    = row.getCell(3).value?.toString().trim();

            // Validaciones básicas
            if (!estado_reporte || !fecha_reporte || !descripcion) return;

            reportes.push([estado_reporte, fecha_reporte, descripcion]);
        });

        if (reportes.length === 0) {
            return res.status(400).json({ mensaje: "El archivo no tiene datos válidos" });
        }

        // Insertar todos en la BD
        await Promise.all(
            reportes.map(r =>
                db.query(
                    "INSERT INTO reportes (estado_reporte, fecha_reporte, descripcion) VALUES (?, ?, ?)",
                    r
                )
            )
        );

        res.json({ mensaje: `${reportes.length} reportes importados correctamente` });

    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: "Error al importar reportes", error });
    }
};

module.exports = { exportarReportesExcel, importarReportesExcel };