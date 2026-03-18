const ExcelJS = require("exceljs");
const fs = require("fs");

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
    // 🧾 ENCABEZADOS
    // =============================
    const headers = ["ID", "Estado", "Fecha", "Evidencia", "Descripción"];
    const headerRow = worksheet.addRow(headers);

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
    // 📊 FILAS + IMÁGENES
    // =============================
    data.forEach((item, index) => {

        const id = item.id_reporte ?? "";
        const estado = item.estado_reporte ? String(item.estado_reporte) : "";
        const descripcion = item.descripcion ? String(item.descripcion) : "";

        // 📅 VALIDAR FECHA
        let fechaValida = "";
        if (
            item.fecha_reporte &&
            item.fecha_reporte !== "0000-00-00 00:00:00" &&
            !isNaN(new Date(item.fecha_reporte))
        ) {
            fechaValida = new Date(item.fecha_reporte);
        }

        // 📊 CREAR FILA (SIN archivo)
        const row = worksheet.addRow([
            id,
            estado,
            fechaValida,
            "", // 🔥 AQUÍ VA LA IMAGEN
            descripcion
        ]);

        // 🎨 ESTILO FILA
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

        // =============================
        // 🖼️ INSERTAR IMAGEN
        // =============================
        if (item.archivo && fs.existsSync(item.archivo)) {
            try {
                const extension = item.archivo.split(".").pop();

                const imageId = workbook.addImage({
                    filename: item.archivo,
                    extension: extension
                });

                worksheet.addImage(imageId, {
                    tl: { col: 3, row: row.number - 1 }, // columna D
                    ext: { width: 100, height: 100 }
                });

                row.height = 80;

            } catch (error) {
                console.log("Error cargando imagen:", error.message);
            }
        }
    });

    // =============================
    // 📏 COLUMNAS
    // =============================
    worksheet.columns = [
        { width: 10 },
        { width: 20 },
        { width: 25 },
        { width: 25 },
        { width: 45 }
    ];

    // =============================
    // ❄️ FIJAR ENCABEZADO
    // =============================
    worksheet.views = [{ state: "frozen", ySplit: 3 }];

    return workbook;
};

module.exports = { generarExcelReportes };