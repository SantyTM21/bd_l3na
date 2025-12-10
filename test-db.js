// test-db.js
const sql = require('mssql')

const config = {
    user: 'servigo_user',
    password: 'Ister123+',
    server: 'TEC-SOP-TICS',   // prueba también 'localhost' si falla
    database: 'ServiGo_db',
    port: 1433,
    options: {
        encrypt: false,
        trustServerCertificate: true
    }
};

(async () => {
    try {
        const pool = await sql.connect(config)
        console.log('✅ Conectado a SQL Server')
        await pool.close()
    } catch (err) {
        console.error('❌ Error de conexión:', err)
    }
})()
