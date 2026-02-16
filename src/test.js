const pool = require("./db/database")

const pruebaConexion = async ()=>{
    try {
        const conexion = await pool.getConnection()
        console.log("✅ Conexion exitosa")
        conexion.release()
    } catch (error) {
        console.log("❌ conexion fallida")
    }
}

pruebaConexion()