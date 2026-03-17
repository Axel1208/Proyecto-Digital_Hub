const db = require("../db/database");
const { generarExcelReportes } = require("../services/excel.service");

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

module.exports = { exportarReportesExcel };