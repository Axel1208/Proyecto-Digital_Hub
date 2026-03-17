const ExcelJS = require("exceljs");

const generarExcelReportes = async (data) => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Reportes");

    // =============================
    // 🎯 TÍTULO
    // =============================
    worksheet.mergeCells("A1:E1");
    const titulo = worksheet.getCell("A1");
    titulo.value = "📊 REPORTE DE DAÑOS - DIGITAL HUB";
    titulo.font = { size: 16, bold: true };
    titulo.alignment = { horizontal: "center" };

    // =============================
    // 📅 FECHA GENERACIÓN
    // =============================
    worksheet.mergeCells("A2:E2");
    const fecha = worksheet.getCell("A2");
    fecha.value = `Generado el: ${new Date().toLocaleString()}`;
    fecha.font = { italic: true };
    fecha.alignment = { horizontal: "center" };

    // =============================
    // 🧾 ENCABEZADOS (MANUAL)
    // =============================
    const headers = ["ID", "Estado", "Fecha", "Archivo", "Descripción"];
    const headerRow = worksheet.addRow(headers);

    // Estilo encabezados
    headerRow.eachCell((cell) => {
        cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
        cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "1F4E78" }
        };
        cell.alignment = { horizontal: "center" };
        cell.border = {
            top: { style: "thin" },
            left: { style: "thin" },
            bottom: { style: "thin" },
            right: { style: "thin" }
        };
    });

    // =============================
    // 📊 FILAS
    // =============================
    data.forEach((item, index) => {

    // 🔥 LIMPIEZA TOTAL DE DATOS

    const id = item.id_reporte ?? "";

    const estado = item.estado_reporte 
        ? String(item.estado_reporte)
        : "";

    const archivo = item.archivo 
        ? String(item.archivo)
        : "";

    const descripcion = item.descripcion 
        ? String(item.descripcion)
        : "";

    // 🔥 VALIDAR FECHA (CRÍTICO)
    let fechaValida = "";

    if (
        item.fecha_reporte &&
        item.fecha_reporte !== "0000-00-00 00:00:00" &&
        !isNaN(new Date(item.fecha_reporte))
    ) {
        fechaValida = new Date(item.fecha_reporte);
    }

    // 📊 AGREGAR FILA SEGURA
    const row = worksheet.addRow([
        id,
        estado,
        fechaValida,
        archivo,
        descripcion
    ]);

    // 🎨 ESTILO
    const color = index % 2 === 0 ? "F2F2F2" : "FFFFFF";

    row.eachCell((cell) => {
        cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: color }
        };
        cell.border = {
            top: { style: "thin" },
            left: { style: "thin" },
            bottom: { style: "thin" },
            right: { style: "thin" }
        };
        cell.alignment = { vertical: "middle" };
    });
});
    // =============================
    // 📏 ANCHO COLUMNAS
    // =============================
    worksheet.columns = [
        { width: 10 },
        { width: 20 },
        { width: 25 },
        { width: 30 },
        { width: 45 }
    ];

    // =============================
    // 📅 FORMATO FECHA
    // =============================
    // worksheet.getColumn(3).numFmt = "yyyy-mm-dd hh:mm";

    // =============================
    // ❄️ FIJAR ENCABEZADO
    // =============================
    worksheet.views = [{ state: "frozen", ySplit: 3 }];

    return workbook;
};

module.exports = { generarExcelReportes };