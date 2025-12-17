import sql from 'mssql'

const config = {
    user: 'db_ac24f6_leronprojects_admin',
    password: 'pwkDn8dh9fh2KFJ',
    server: 'sql5113.site4now.net',
    database: 'db_ac24f6_leronprojects',
    port: 1433,
    options: {
        encrypt: true,               // requerido por hosting remoto
        trustServerCertificate: true // OK para pruebas
    }
}

async function test() {
    let pool
    try {
        pool = await sql.connect(config)
        const result = await pool
            .request()
            .query('SELECT @@VERSION AS version')

        console.log(result.recordset)
    } catch (err) {
        console.error('Error de conexión:', err)
    } finally {
        if (pool) await pool.close()
    }
}

test()
