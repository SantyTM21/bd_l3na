    TABLA      --- ENCARGADA


CREATE DATABASE ServiGo_db;
GO
USE ServiGo_db;
GO

-- Tabla: Roles
CREATE TABLE Roles (
    IdRol INT PRIMARY KEY IDENTITY(1,1),
    Nombre VARCHAR(50) NOT NULL,
    Descripcion VARCHAR(200)
);

-- Tabla: Usuarios
CREATE TABLE Usuarios (
    IdUsuario INT PRIMARY KEY IDENTITY(1,1),
    Cedula VARCHAR(10) NOT NULL UNIQUE,
    Nombre VARCHAR(50) NOT NULL,
    Apellido VARCHAR(50) NOT NULL,
    Correo VARCHAR(100) NOT NULL UNIQUE,
    Password VARCHAR(200) NOT NULL,
    Estado BIT NOT NULL DEFAULT 1,      -- 1 = Activo, 0 = Inactivo
    Celular VARCHAR(15),
    FechaNacimiento DATE,
    FechaRegistro DATETIME DEFAULT GETDATE(),
    IdRol INT NOT NULL
);

-- Tabla: CuentasBanco
CREATE TABLE CuentasBanco (
    IdCuentaBanco INT PRIMARY KEY IDENTITY(1,1),
    NombreBanco VARCHAR(100) NOT NULL,
    NumeroCuenta VARCHAR(30) NOT NULL UNIQUE,
    TipoCuenta VARCHAR(20),
    Estado BIT NOT NULL DEFAULT 1,      -- 1 = Activa, 0 = Inactiva
    Dueño VARCHAR(100),
    Saldo DECIMAL(10,2) DEFAULT 0,
    FechaRegistro DATETIME DEFAULT GETDATE(),
    IdUsuario INT NOT NULL
);

-- Tabla: Servicios
CREATE TABLE Servicios (
    IdServicio INT PRIMARY KEY IDENTITY(1,1),
    Nombre VARCHAR(100) NOT NULL,
    Descripcion VARCHAR(200),
    NumeroCuenta VARCHAR(30),
    IdUsuario INT NOT NULL,
    TipoPeriodo VARCHAR(10),
    Estado BIT NOT NULL DEFAULT 1,      -- 1 = Activo, 0 = Inactivo
    FechaRegistro DATETIME DEFAULT GETDATE(),
    FechaPago DATE,
    Precio DECIMAL(10,2) NOT NULL,
    EsAutomatico BIT DEFAULT 0
);

-- Tabla: Pagos
CREATE TABLE Pagos (
    IdPago INT PRIMARY KEY IDENTITY(1,1),
    IdServicio INT NOT NULL,
    Monto DECIMAL(10,2) NOT NULL,
    FechaPago DATE,
    Comentario VARCHAR(200),
    MetodoPago VARCHAR(50),
    IdCuentaBanco INT NOT NULL
);

-- Tabla: Transferencias
CREATE TABLE Transferencias (
    IdTransferencia INT PRIMARY KEY IDENTITY(1,1),
    IdCuentaBanco INT NOT NULL,
    Fecha DATETIME DEFAULT GETDATE(),
    TipoTransferencia VARCHAR(10),
    Comentario VARCHAR(200),
    Monto DECIMAL(10,2) NOT NULL,
    Destinatario VARCHAR(100)
);

-- CHECKS
ALTER TABLE Usuarios
ADD CONSTRAINT CHK_Usuarios_Estado
CHECK (Estado IN (0,1));
GO

ALTER TABLE CuentasBanco
ADD CONSTRAINT CHK_CuentasBanco_TipoCuenta
CHECK (TipoCuenta IN ('Ahorros', 'Corriente'));
GO

ALTER TABLE Servicios
ADD CONSTRAINT CHK_Servicios_TipoPeriodo
CHECK (TipoPeriodo IN ('Mensual', 'Anual'));
GO

ALTER TABLE Servicios
ADD CONSTRAINT CHK_Servicios_Estado
CHECK (Estado IN (0,1));
GO

ALTER TABLE Transferencias
ADD CONSTRAINT CHK_Transferencias_Tipo
CHECK (TipoTransferencia IN ('Ingreso', 'Egreso'));
GO

-- FKs
ALTER TABLE Usuarios
ADD CONSTRAINT FK_Usuarios_Roles
FOREIGN KEY (IdRol) REFERENCES Roles(IdRol)
ON DELETE CASCADE
ON UPDATE CASCADE;
GO

ALTER TABLE CuentasBanco
ADD CONSTRAINT FK_CuentasBanco_Usuarios
FOREIGN KEY (IdUsuario) REFERENCES Usuarios(IdUsuario)
ON DELETE CASCADE
ON UPDATE CASCADE;
GO

ALTER TABLE Servicios
ADD CONSTRAINT FK_Servicios_Usuarios
FOREIGN KEY (IdUsuario) REFERENCES Usuarios(IdUsuario)
ON DELETE CASCADE
ON UPDATE CASCADE;
GO

ALTER TABLE Pagos
ADD CONSTRAINT FK_Pagos_CuentasBanco
FOREIGN KEY (IdCuentaBanco) REFERENCES CuentasBanco(IdCuentaBanco)
ON DELETE CASCADE
ON UPDATE CASCADE;
GO

ALTER TABLE Transferencias
ADD CONSTRAINT FK_Transferencias_CuentasBanco
FOREIGN KEY (IdCuentaBanco) REFERENCES CuentasBanco(IdCuentaBanco)
ON DELETE CASCADE
ON UPDATE CASCADE;
GO

-- DATA
INSERT INTO Roles (Nombre, Descripcion) VALUES
('Administrador', 'Acceso total al sistema'),
('Usuario', 'Acceso limitado a sus servicios'),
('Contador', 'Gestión de pagos y transferencias'),
('Soporte', 'Atención técnica'),
('Supervisor', 'Monitoreo de usuarios'),
('Cajero', 'Gestión de cuentas bancarias'),
('Cliente', 'Uso de servicios'),
('Gerente', 'Control general'),
('Auditor', 'Revisión de registros'),
('Invitado', 'Acceso temporal');

INSERT INTO Usuarios (Cedula, Nombre, Apellido, Correo, FechaNacimiento, Password, Estado, IdRol) VALUES
('1712345678','Priscila','Quiñonez','priscila@email.com','2000-05-10','clave123',1,1),
('0803456789','Charly','Paez','charly@email.com','1995-08-22','segura456',1,2),
('0501923456','Anabell','Montero','anabell@email.com','1998-03-15','pass789',1,2),
('1204567890','Dario','Sanchez','dario@email.com','1992-11-30','clave321',1,2),
('0702654321','Paola','Toro','paola@email.com','1999-07-25','segura654',1,2),
('0401987654','Jadira','Vega','jadira@email.com','1990-01-12','pass987',1,2),
('1103572468','Andreina','Bravo','andreina@email.com','1997-09-05','clave741',1,2),
('0904281357','Dillan','Calan','dillan@email.com','1994-04-18','segura852',1,2),
('0605918246','Silvia','Mendez','silvia@email.com','1996-12-01','pass963',1,2),
('0302468135','Piter','Sarmiento','piter@email.com','1993-06-20','clave159',1,2);

INSERT INTO CuentasBanco (NombreBanco, NumeroCuenta, TipoCuenta, Dueño, IdUsuario) VALUES
('Banco Pichincha','7421-3598-6123-0846','Ahorros','Priscila Quiñonez',1),
('Banco Guayaquil','5198-2467-1359-8024','Corriente','Charly Paez',2),
('Banco Produbanco','6839-2715-9842-0637','Ahorros','Anabell Montero',3),
('Banco Internacional','9241-7583-6192-0458','Corriente','Dario Sanchez',4),
('Banco Bolivariano','3571-9826-7431-0592','Ahorros','Paola Toro',5),
('Banco Pichincha','4682-1357-9284-6173','Corriente','Jadira Vega',6),
('Banco Guayaquil','8193-5742-3619-0854','Ahorros','Andreaina Bravo',7),
('Banco Produbanco','2759-8143-6297-0531','Corriente','Dillan Calan',8),
('Banco Internacional','9437-1826-3549-0672','Ahorros','Silvia Mendez',9),
('Banco Bolivariano','1568-4937-2851-9643','Corriente','Piter Sarmiento',10);

INSERT INTO Servicios (Nombre, Descripcion, NumeroCuenta, IdUsuario, TipoPeriodo, Estado, Precio) VALUES
('Internet Hogar','Plan mensual 100 Mbps','7421-3598-6123-0846',1,'Mensual',1,25.00),
('Netflix','Suscripción anual','5198-2467-1359-8024',2,'Anual',1,120.00),
('Agua Potable','Servicio básico mensual','6839-2715-9842-0637',3,'Mensual',1,15.00),
('Electricidad','Plan mensual','9241-7583-6192-0458',4,'Mensual',1,30.00),
('Spotify','Suscripción anual','3571-9826-7431-0592',5,'Anual',1,99.00),
('Telefonía Móvil','Plan mensual','4682-1357-9284-6173',6,'Mensual',1,20.00),
('Amazon Prime','Suscripción anual','8193-5742-3619-0854',7,'Anual',1,80.00),
('Gas Domiciliario','Servicio mensual','2759-8143-6297-0531',8,'Mensual',1,18.00),
('Disney+','Suscripción anual','9437-1826-3549-0672',9,'Anual',1,110.00),
('Internet Oficina','Plan mensual 200 Mbps','1568-4937-2851-9643',10,'Mensual',1,50.00);

INSERT INTO Pagos (IdServicio, Monto, MetodoPago, IdCuentaBanco) VALUES
(1,25.00,'Transferencia',1),
(2,120.00,'Tarjeta',2),
(3,15.00,'Efectivo',3),
(4,30.00,'Transferencia',4),
(5,99.00,'QR',5),
(6,20.00,'Tarjeta',6),
(7,80.00,'Transferencia',7),
(8,18.00,'Efectivo',8),
(9,110.00,'Tarjeta',9),
(10,50.00,'Transferencia',10);

INSERT INTO Transferencias (IdCuentaBanco, TipoTransferencia, Monto, Destinatario) VALUES
(1,'Ingreso',100.00,'Priscila Quiñonez'),
(2,'Egreso',50.00,'Netflix Inc.'),
(3,'Ingreso',200.00,'Anabell Montero'),
(4,'Egreso',75.00,'Empresa Eléctrica'),
(5,'Ingreso',150.00,'Paola Toro'),
(6,'Egreso',40.00,'Operadora Móvil'),
(7,'Ingreso',300.00,'Andreaina Bravo'),
(8,'Egreso',60.00,'Gas Natural'),
(9,'Ingreso',250.00,'Silvia Mendez'),
(10,'Egreso',90.00,'Proveedor Internet');

-- INSERT extra
INSERT INTO Servicios (Nombre, Descripcion, NumeroCuenta, IdUsuario, TipoPeriodo, Estado, Precio, FechaRegistro)
VALUES ('HBO Max','Suscripción anual de streaming','7421-3598-6123-0846',1,'Anual',1,150.00,GETDATE());

INSERT INTO Pagos (IdServicio, Monto, MetodoPago, IdCuentaBanco, FechaPago, Comentario)
VALUES (1,150.00,'Transferencia',1,GETDATE(),'Pago de HBO Max');

INSERT INTO Transferencias (IdCuentaBanco, TipoTransferencia, Monto, Destinatario, Comentario)
VALUES (1,'Egreso',150.00,'HBO Max','Transferencia automática de suscripción');

-- UPDATE ejemplos
UPDATE Servicios
SET Precio = 160.00, Estado = 1
WHERE IdServicio = 1;

UPDATE Pagos
SET MetodoPago = 'Tarjeta', Monto = 155.00
WHERE IdPago = 1;

UPDATE Transferencias
SET Comentario = 'Pago ajustado de suscripción HBO Max'
WHERE IdTransferencia = 1;

-- DELETE ejemplos
DELETE FROM Servicios WHERE IdServicio = 2;
DELETE FROM Pagos WHERE IdPago = 2;
DELETE FROM Transferencias WHERE IdTransferencia = 2;

---------------- VISTAS ----------------
GO
CREATE VIEW vw_ServiciosUsuarios AS
SELECT 
    s.IdServicio,
    s.Nombre AS Servicio,
    s.TipoPeriodo,
    s.Estado,
    s.Precio,
    u.Nombre + ' ' + u.Apellido AS Usuario
FROM Servicios s
INNER JOIN Usuarios u ON s.IdUsuario = u.IdUsuario;
GO

CREATE VIEW vw_PagosServicios AS
SELECT 
    p.IdPago,
    p.Monto,
    p.FechaPago,
    p.MetodoPago,
    s.Nombre AS Servicio,
    u.Nombre + ' ' + u.Apellido AS Usuario,
    cb.NombreBanco
FROM Pagos p
INNER JOIN Servicios s ON p.IdServicio = s.IdServicio
INNER JOIN Usuarios u ON s.IdUsuario = u.IdUsuario
INNER JOIN CuentasBanco cb ON p.IdCuentaBanco = cb.IdCuentaBanco;
GO

CREATE VIEW vw_TransferenciasCuentas AS
SELECT
    t.Monto,
    t.Fecha,
    t.Destinatario,
    cb.NombreBanco,
    cb.NumeroCuenta,
    cb.Dueño
FROM Transferencias t
INNER JOIN CuentasBanco cb ON t.IdCuentaBanco = cb.IdCuentaBanco;
GO

CREATE VIEW vw_CuentasBanco AS
SELECT 
    c.IdCuentaBanco,
    c.NombreBanco,
    c.NumeroCuenta,
    c.TipoCuenta,
    c.Estado,
    c.Dueño,
    c.Saldo,
    c.FechaRegistro,
    u.Nombre + ' ' + u.Apellido AS Usuario
FROM CuentasBanco c
JOIN Usuarios u ON c.IdUsuario = u.IdUsuario;
GO

-- Vistas adicionales
CREATE VIEW vw_UsuariosActivosResumen AS
SELECT 
    u.IdUsuario,
    u.Nombre + ' ' + u.Apellido AS Usuario,
    COUNT(DISTINCT cb.IdCuentaBanco) AS TotalCuentas,
    COUNT(DISTINCT s.IdServicio)     AS TotalServicios
FROM Usuarios u
LEFT JOIN CuentasBanco cb ON cb.IdUsuario = u.IdUsuario
LEFT JOIN Servicios    s  ON s.IdUsuario  = u.IdUsuario
WHERE u.Estado = 1
GROUP BY u.IdUsuario, u.Nombre, u.Apellido;
GO

CREATE VIEW vw_SaldoPorUsuario AS
SELECT
    u.IdUsuario,
    u.Nombre + ' ' + u.Apellido AS Usuario,
    ISNULL(SUM(cb.Saldo),0)     AS SaldoTotal
FROM Usuarios u
LEFT JOIN CuentasBanco cb ON cb.IdUsuario = u.IdUsuario
GROUP BY u.IdUsuario, u.Nombre, u.Apellido;
GO

--------------- STORED PROCEDURES ---------------
-- Insertar Servicio
CREATE PROCEDURE sp_InsertarServicio
    @Nombre VARCHAR(100),
    @Descripcion VARCHAR(200),
    @NumeroCuenta VARCHAR(30),
    @IdUsuario INT,
    @TipoPeriodo VARCHAR(10),
    @Precio DECIMAL(10,2)
AS
BEGIN
    INSERT INTO Servicios (Nombre, Descripcion, NumeroCuenta, IdUsuario, TipoPeriodo, Estado, Precio, FechaRegistro)
    VALUES (@Nombre, @Descripcion, @NumeroCuenta, @IdUsuario, @TipoPeriodo, 1, @Precio, GETDATE());
END;
GO

-- Insertar Pago
CREATE PROCEDURE sp_InsertarPago
    @IdServicio INT,
    @Monto DECIMAL(10,2),
    @MetodoPago VARCHAR(50),
    @IdCuentaBanco INT,
    @Comentario VARCHAR(200) = NULL
AS
BEGIN
    INSERT INTO Pagos (IdServicio, Monto, MetodoPago, IdCuentaBanco, FechaPago, Comentario)
    VALUES (@IdServicio, @Monto, @MetodoPago, @IdCuentaBanco, GETDATE(), @Comentario);
END;
GO

-- Insertar Transferencia
CREATE PROCEDURE sp_InsertarTransferencia
    @IdCuentaBanco INT,
    @TipoTransferencia VARCHAR(10),
    @Monto DECIMAL(10,2),
    @Destinatario VARCHAR(100),
    @Comentario VARCHAR(200) = NULL
AS
BEGIN
    INSERT INTO Transferencias (IdCuentaBanco, TipoTransferencia, Monto, Destinatario, Comentario, Fecha)
    VALUES (@IdCuentaBanco, @TipoTransferencia, @Monto, @Destinatario, @Comentario, GETDATE());
END;
GO

-- Actualizar Servicio
CREATE PROCEDURE sp_ActualizarServicio
    @IdServicio    INT,
    @Nombre        VARCHAR(100),
    @Descripcion   VARCHAR(200),
    @NumeroCuenta  VARCHAR(30),
    @TipoPeriodo   VARCHAR(10),
    @Estado        BIT,
    @Precio        DECIMAL(10,2),
    @EsAutomatico  BIT
AS
BEGIN
    UPDATE Servicios
    SET Nombre       = @Nombre,
        Descripcion  = @Descripcion,
        NumeroCuenta = @NumeroCuenta,
        TipoPeriodo  = @TipoPeriodo,
        Estado       = @Estado,
        Precio       = @Precio,
        EsAutomatico = @EsAutomatico
    WHERE IdServicio = @IdServicio;
END;
GO

-- Actualizar Pago
CREATE PROCEDURE sp_ActualizarPago
    @IdPago      INT,
    @Monto       DECIMAL(10,2),
    @MetodoPago  VARCHAR(50),
    @Comentario  VARCHAR(200)
AS
BEGIN
    UPDATE Pagos
    SET Monto      = @Monto,
        MetodoPago = @MetodoPago,
        Comentario = @Comentario
    WHERE IdPago   = @IdPago;
END;
GO

-- Actualizar Transferencia
CREATE PROCEDURE sp_ActualizarTransferencia
    @IdTransferencia   INT,
    @TipoTransferencia VARCHAR(10),
    @Monto             DECIMAL(10,2),
    @Destinatario      VARCHAR(100),
    @Comentario        VARCHAR(200)
AS
BEGIN
    UPDATE Transferencias
    SET TipoTransferencia = @TipoTransferencia,
        Monto             = @Monto,
        Destinatario      = @Destinatario,
        Comentario        = @Comentario
    WHERE IdTransferencia = @IdTransferencia;
END;
GO

-- Eliminar Servicio
CREATE PROCEDURE sp_EliminarServicio
    @IdServicio INT
AS
BEGIN
    DELETE FROM Servicios
    WHERE IdServicio = @IdServicio;
END;
GO

-- Eliminar Pago
CREATE PROCEDURE sp_EliminarPago
    @IdPago INT
AS
BEGIN
    DELETE FROM Pagos
    WHERE IdPago = @IdPago;
END;
GO

-- Eliminar Transferencia
CREATE PROCEDURE sp_EliminarTransferencia
    @IdTransferencia INT
AS
BEGIN
    DELETE FROM Transferencias
    WHERE IdTransferencia = @IdTransferencia;
END;
GO

-- Eliminar Usuario (cascade por FKs)
CREATE PROCEDURE sp_EliminarUsuario
    @IdUsuario INT
AS
BEGIN
    DELETE FROM Usuarios
    WHERE IdUsuario = @IdUsuario;
END;
GO

--------------- TRIGGERS ---------------
-- Setea FechaPago en base al período
CREATE TRIGGER trg_SetFechaPagoServicio
ON Servicios
AFTER INSERT
AS
BEGIN
    UPDATE s
    SET FechaPago = 
        CASE 
            WHEN s.TipoPeriodo = 'Mensual' THEN DATEADD(DAY, 30, s.FechaRegistro)
            WHEN s.TipoPeriodo = 'Anual'   THEN DATEADD(DAY, 365, s.FechaRegistro)
        END
    FROM Servicios s
    INNER JOIN inserted i ON s.IdServicio = i.IdServicio;
END;
GO

-- Actualizar Saldo cuando hay Pago (egreso)
CREATE TRIGGER trg_ActualizarSaldoPago
ON Pagos
AFTER INSERT
AS
BEGIN
    DECLARE @IdCuentaBanco INT, @Monto DECIMAL(10,2);

    SELECT @IdCuentaBanco = IdCuentaBanco, @Monto = Monto
    FROM inserted;

    UPDATE CuentasBanco
    SET Saldo = Saldo - @Monto
    WHERE IdCuentaBanco = @IdCuentaBanco;
END;
GO

-- Actualizar Saldo por Transferencia
CREATE TRIGGER trg_ActualizarSaldoTransferencia
ON Transferencias
AFTER INSERT
AS
BEGIN
    DECLARE @IdCuentaBanco INT, @Monto DECIMAL(10,2), @Tipo VARCHAR(10);

    SELECT @IdCuentaBanco = IdCuentaBanco, @Monto = Monto, @Tipo = TipoTransferencia
    FROM inserted;

    IF @Tipo = 'Ingreso'
        UPDATE CuentasBanco
        SET Saldo = Saldo + @Monto
        WHERE IdCuentaBanco = @IdCuentaBanco;

    IF @Tipo = 'Egreso'
        UPDATE CuentasBanco
        SET Saldo = Saldo - @Monto
        WHERE IdCuentaBanco = @IdCuentaBanco;
END;
GO

-- No permitir saldo negativo en cuentas
CREATE TRIGGER trg_NoSaldoNegativoCuentasBanco
ON CuentasBanco
AFTER UPDATE
AS
BEGIN
    IF EXISTS (SELECT 1 FROM inserted WHERE Saldo < 0)
    BEGIN
        RAISERROR('El saldo de la cuenta no puede ser negativo.', 16, 1);
        ROLLBACK TRANSACTION;
    END
END;
GO

-- Si un usuario se inactiva, desactivar sus servicios
CREATE TRIGGER trg_DesactivarServiciosUsuario
ON Usuarios
AFTER UPDATE
AS
BEGIN
    UPDATE s
    SET s.Estado       = 0,
        s.EsAutomatico = 0
    FROM Servicios s
    INNER JOIN inserted i
        ON s.IdUsuario = i.IdUsuario
    WHERE i.Estado = 0;
END;
GO

--------------- CONSULTAS DE EJEMPLO ---------------
-- Servicios activos por usuario
SELECT 
    u.Nombre + ' ' + u.Apellido AS Usuario,
    COUNT(s.IdServicio) AS ServiciosActivos,
    SUM(s.Precio) AS TotalAPagar
FROM Servicios s
JOIN Usuarios u ON s.IdUsuario = u.IdUsuario
WHERE s.Estado = 1
GROUP BY u.Nombre, u.Apellido
ORDER BY TotalAPagar DESC;

-- Pagos por usuario y método
SELECT 
    u.Nombre + ' ' + u.Apellido AS Usuario,
    p.MetodoPago,
    SUM(p.Monto) AS TotalPagado
FROM Pagos p
JOIN Servicios s ON p.IdServicio = s.IdServicio
JOIN Usuarios u ON s.IdUsuario = u.IdUsuario
GROUP BY u.Nombre, u.Apellido, p.MetodoPago
ORDER BY Usuario, TotalPagado DESC;

-- Egresos > 50 por banco
SELECT 
    cb.NombreBanco,
    COUNT(t.IdTransferencia) AS TotalEgresos,
    SUM(t.Monto) AS MontoTotal
FROM Transferencias t
JOIN CuentasBanco cb ON t.IdCuentaBanco = cb.IdCuentaBanco
WHERE t.TipoTransferencia = 'Egreso' AND t.Monto > 50
GROUP BY cb.NombreBanco
ORDER BY MontoTotal DESC;

-- Ejemplos de uso de FKs
DECLARE @UserDesactivar INT = 1;
UPDATE s
SET s.Estado = 0
FROM Servicios s
INNER JOIN Usuarios u ON s.IdUsuario = u.IdUsuario
WHERE u.IdUsuario = @UserDesactivar;

DECLARE @CuentaEliminar INT = 3;
DELETE t
FROM Transferencias t
INNER JOIN CuentasBanco cb ON t.IdCuentaBanco = cb.IdCuentaBanco
WHERE cb.IdCuentaBanco = @CuentaEliminar;
