CREATE TABLE dbo.Roles (
    IdRol INT PRIMARY KEY IDENTITY(1,1),
    Nombre VARCHAR(50) NOT NULL,
    Descripcion VARCHAR(200),
    FechaRegistro DATETIME NOT NULL DEFAULT GETDATE(),
    FechaActualizacion DATETIME NULL
);
GO

CREATE TABLE dbo.Usuarios (
    IdUsuario INT PRIMARY KEY IDENTITY(1,1),
    Cedula VARCHAR(10) NOT NULL UNIQUE,
    Nombre VARCHAR(50) NOT NULL,
    Apellido VARCHAR(50) NOT NULL,
    Correo VARCHAR(100) NOT NULL UNIQUE,
    Password VARCHAR(200) NOT NULL,
    Estado BIT NOT NULL DEFAULT 1,
    Celular VARCHAR(15),
    FechaNacimiento DATE,
    FechaRegistro DATETIME NOT NULL DEFAULT GETDATE(),
    FechaActualizacion DATETIME NULL,
    IdRol INT NOT NULL
);
GO

CREATE TABLE dbo.CuentasBanco (
    IdCuentaBanco INT PRIMARY KEY IDENTITY(1,1),
    NombreBanco VARCHAR(100) NOT NULL,
    NumeroCuenta VARCHAR(30) NOT NULL UNIQUE,
    TipoCuenta VARCHAR(20) NOT NULL,
    Estado BIT NOT NULL DEFAULT 1,
    Dueño VARCHAR(100),
    Saldo DECIMAL(10,2) NOT NULL DEFAULT 0,
    FechaRegistro DATETIME NOT NULL DEFAULT GETDATE(),
    FechaActualizacion DATETIME NULL,
    IdUsuario INT NOT NULL
);
GO

CREATE TABLE dbo.Servicios (
    IdServicio INT PRIMARY KEY IDENTITY(1,1),
    Nombre VARCHAR(100) NOT NULL,
    Descripcion VARCHAR(200),
    NumeroCuenta VARCHAR(30),
    IdUsuario INT NOT NULL,
    TipoPeriodo VARCHAR(10) NOT NULL,
    Estado BIT NOT NULL DEFAULT 1,
    FechaRegistro DATETIME NOT NULL DEFAULT GETDATE(),
    FechaActualizacion DATETIME NULL,
    FechaPago DATE NULL,
    Precio DECIMAL(10,2) NOT NULL,
    EsAutomatico BIT NOT NULL DEFAULT 0
);
GO

CREATE TABLE dbo.Pagos (
    IdPago INT PRIMARY KEY IDENTITY(1,1),
    IdServicio INT NOT NULL,
    Monto DECIMAL(10,2) NOT NULL,
    FechaPago DATE NULL,
    Comentario VARCHAR(200),
    MetodoPago VARCHAR(50),
    IdCuentaBanco INT NULL,
    FechaRegistro DATETIME NOT NULL DEFAULT GETDATE(),
    FechaActualizacion DATETIME NULL
);
GO

CREATE TABLE dbo.Transferencias (
    IdTransferencia INT PRIMARY KEY IDENTITY(1,1),
    IdCuentaBanco INT NOT NULL,
    Fecha DATETIME NOT NULL DEFAULT GETDATE(),
    TipoTransferencia VARCHAR(10) NOT NULL,
    Comentario VARCHAR(200),
    Monto DECIMAL(10,2) NOT NULL,
    Destinatario VARCHAR(100),
    FechaRegistro DATETIME NOT NULL DEFAULT GETDATE(),
    FechaActualizacion DATETIME NULL
);
GO

ALTER TABLE dbo.Usuarios
ADD CONSTRAINT CHK_Usuarios_Estado CHECK (Estado IN (0,1));
GO

ALTER TABLE dbo.CuentasBanco
ADD CONSTRAINT CHK_CuentasBanco_TipoCuenta CHECK (TipoCuenta IN ('Ahorros', 'Corriente'));
GO

ALTER TABLE dbo.Servicios
ADD CONSTRAINT CHK_Servicios_TipoPeriodo CHECK (TipoPeriodo IN ('Mensual', 'Anual'));
GO

ALTER TABLE dbo.Servicios
ADD CONSTRAINT CHK_Servicios_Estado CHECK (Estado IN (0,1));
GO

ALTER TABLE dbo.Transferencias
ADD CONSTRAINT CHK_Transferencias_Tipo CHECK (TipoTransferencia IN ('Ingreso', 'Egreso'));
GO

ALTER TABLE dbo.Usuarios
ADD CONSTRAINT FK_Usuarios_Roles
FOREIGN KEY (IdRol) REFERENCES dbo.Roles(IdRol)
ON DELETE CASCADE
ON UPDATE CASCADE;
GO

ALTER TABLE dbo.CuentasBanco
ADD CONSTRAINT FK_CuentasBanco_Usuarios
FOREIGN KEY (IdUsuario) REFERENCES dbo.Usuarios(IdUsuario)
ON DELETE CASCADE
ON UPDATE CASCADE;
GO

ALTER TABLE dbo.Servicios
ADD CONSTRAINT FK_Servicios_Usuarios
FOREIGN KEY (IdUsuario) REFERENCES dbo.Usuarios(IdUsuario)
ON DELETE CASCADE
ON UPDATE CASCADE;
GO

ALTER TABLE dbo.Pagos
ADD CONSTRAINT FK_Pagos_CuentasBanco
FOREIGN KEY (IdCuentaBanco) REFERENCES dbo.CuentasBanco(IdCuentaBanco)
ON DELETE SET NULL
ON UPDATE CASCADE;
GO

ALTER TABLE dbo.Transferencias
ADD CONSTRAINT FK_Transferencias_CuentasBanco
FOREIGN KEY (IdCuentaBanco) REFERENCES dbo.CuentasBanco(IdCuentaBanco)
ON DELETE CASCADE
ON UPDATE CASCADE;
GO

ALTER TABLE dbo.Pagos
ADD CONSTRAINT FK_Pagos_Servicios
FOREIGN KEY (IdServicio) REFERENCES dbo.Servicios(IdServicio)
ON DELETE CASCADE
ON UPDATE CASCADE;
GO

INSERT INTO dbo.Roles (Nombre, Descripcion) VALUES
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
GO

INSERT INTO dbo.Usuarios (Cedula, Nombre, Apellido, Correo, FechaNacimiento, Password, Estado, IdRol) VALUES
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
GO

INSERT INTO dbo.CuentasBanco (NombreBanco, NumeroCuenta, TipoCuenta, Dueño, IdUsuario) VALUES
('Banco Pichincha','7421-3598-6123-0846','Ahorros','Priscila Quiñonez',1),
('Banco Guayaquil','5198-2467-1359-8024','Corriente','Charly Paez',2),
('Banco Produbanco','6839-2715-9842-0637','Ahorros','Anabell Montero',3),
('Banco Internacional','9241-7583-6192-0458','Corriente','Dario Sanchez',4),
('Banco Bolivariano','3571-9826-7431-0592','Ahorros','Paola Toro',5),
('Banco Pichincha','4682-1357-9284-6173','Corriente','Jadira Vega',6),
('Banco Guayaquil','8193-5742-3619-0854','Ahorros','Andreina Bravo',7),
('Banco Produbanco','2759-8143-6297-0531','Corriente','Dillan Calan',8),
('Banco Internacional','9437-1826-3549-0672','Ahorros','Silvia Mendez',9),
('Banco Bolivariano','1568-4937-2851-9643','Corriente','Piter Sarmiento',10);
GO

INSERT INTO dbo.Servicios (Nombre, Descripcion, NumeroCuenta, IdUsuario, TipoPeriodo, Estado, Precio) VALUES
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
GO

INSERT INTO dbo.Pagos (IdServicio, Monto, MetodoPago, IdCuentaBanco) VALUES
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
GO

INSERT INTO dbo.Transferencias (IdCuentaBanco, TipoTransferencia, Monto, Destinatario) VALUES
(1,'Ingreso',100.00,'Priscila Quiñonez'),
(2,'Egreso',50.00,'Netflix Inc.'),
(3,'Ingreso',200.00,'Anabell Montero'),
(4,'Egreso',75.00,'Empresa Eléctrica'),
(5,'Ingreso',150.00,'Paola Toro'),
(6,'Egreso',40.00,'Operadora Móvil'),
(7,'Ingreso',300.00,'Andreina Bravo'),
(8,'Egreso',60.00,'Gas Natural'),
(9,'Ingreso',250.00,'Silvia Mendez'),
(10,'Egreso',90.00,'Proveedor Internet');
GO

INSERT INTO dbo.Servicios (Nombre, Descripcion, NumeroCuenta, IdUsuario, TipoPeriodo, Estado, Precio, FechaRegistro)
VALUES ('HBO Max','Suscripción anual de streaming','7421-3598-6123-0846',1,'Anual',1,150.00,GETDATE());
GO

INSERT INTO dbo.Pagos (IdServicio, Monto, MetodoPago, IdCuentaBanco, FechaPago, Comentario)
VALUES (1,150.00,'Transferencia',1,GETDATE(),'Pago de HBO Max');
GO

INSERT INTO dbo.Transferencias (IdCuentaBanco, TipoTransferencia, Monto, Destinatario, Comentario)
VALUES (1,'Egreso',150.00,'HBO Max','Transferencia automática de suscripción');
GO

CREATE VIEW dbo.vw_ServiciosUsuarios AS
SELECT
    s.IdServicio,
    s.Nombre AS Servicio,
    s.TipoPeriodo,
    s.Estado,
    s.Precio,
    u.Nombre + ' ' + u.Apellido AS Usuario
FROM dbo.Servicios s
INNER JOIN dbo.Usuarios u ON s.IdUsuario = u.IdUsuario;
GO

CREATE VIEW dbo.vw_PagosServicios AS
SELECT
    p.IdPago,
    p.Monto,
    p.FechaPago,
    p.MetodoPago,
    s.Nombre AS Servicio,
    u.Nombre + ' ' + u.Apellido AS Usuario,
    cb.NombreBanco
FROM dbo.Pagos p
INNER JOIN dbo.Servicios s ON p.IdServicio = s.IdServicio
INNER JOIN dbo.Usuarios u ON s.IdUsuario = u.IdUsuario
LEFT JOIN dbo.CuentasBanco cb ON p.IdCuentaBanco = cb.IdCuentaBanco;
GO

CREATE VIEW dbo.vw_TransferenciasCuentas AS
SELECT
    t.Monto,
    t.Fecha,
    t.Destinatario,
    cb.NombreBanco,
    cb.NumeroCuenta,
    cb.Dueño
FROM dbo.Transferencias t
INNER JOIN dbo.CuentasBanco cb ON t.IdCuentaBanco = cb.IdCuentaBanco;
GO

CREATE VIEW dbo.vw_CuentasBanco AS
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
FROM dbo.CuentasBanco c
JOIN dbo.Usuarios u ON c.IdUsuario = u.IdUsuario;
GO

CREATE VIEW dbo.vw_UsuariosActivosResumen AS
SELECT
    u.IdUsuario,
    u.Nombre + ' ' + u.Apellido AS Usuario,
    COUNT(DISTINCT cb.IdCuentaBanco) AS TotalCuentas,
    COUNT(DISTINCT s.IdServicio) AS TotalServicios
FROM dbo.Usuarios u
LEFT JOIN dbo.CuentasBanco cb ON cb.IdUsuario = u.IdUsuario
LEFT JOIN dbo.Servicios s ON s.IdUsuario = u.IdUsuario
WHERE u.Estado = 1
GROUP BY u.IdUsuario, u.Nombre, u.Apellido;
GO

CREATE VIEW dbo.vw_SaldoPorUsuario AS
SELECT
    u.IdUsuario,
    u.Nombre + ' ' + u.Apellido AS Usuario,
    ISNULL(SUM(cb.Saldo),0) AS SaldoTotal
FROM dbo.Usuarios u
LEFT JOIN dbo.CuentasBanco cb ON cb.IdUsuario = u.IdUsuario
GROUP BY u.IdUsuario, u.Nombre, u.Apellido;
GO

CREATE OR ALTER VIEW dbo.vw_Admin_KPIs AS
SELECT
  (SELECT COUNT(*) FROM dbo.Usuarios) AS TotalUsuarios,
  (SELECT COUNT(*) FROM dbo.Usuarios WHERE Estado = 1) AS UsuariosActivos,
  (SELECT COUNT(*) FROM dbo.Usuarios WHERE Estado = 0) AS UsuariosInactivos,
  (SELECT COUNT(*) FROM dbo.CuentasBanco) AS TotalCuentas,
  (SELECT COUNT(*) FROM dbo.CuentasBanco WHERE Estado = 1) AS CuentasActivas,
  (SELECT COUNT(*) FROM dbo.Servicios) AS TotalServicios,
  (SELECT COUNT(*) FROM dbo.Servicios WHERE Estado = 1) AS ServiciosActivos,
  (SELECT COUNT(*) FROM dbo.Pagos) AS TotalPagos,
  (SELECT ISNULL(SUM(Monto),0) FROM dbo.Pagos) AS MontoPagosTotal,
  (SELECT COUNT(*) FROM dbo.Pagos WHERE IdCuentaBanco IS NULL) AS PagosSinCuenta,
  (SELECT COUNT(*) FROM dbo.Transferencias) AS TotalTransferencias,
  (SELECT ISNULL(SUM(Monto),0) FROM dbo.Transferencias WHERE TipoTransferencia='Ingreso') AS TotalIngresos,
  (SELECT ISNULL(SUM(Monto),0) FROM dbo.Transferencias WHERE TipoTransferencia='Egreso') AS TotalEgresos;
GO

CREATE OR ALTER VIEW dbo.vw_Admin_UsuariosResumen AS
SELECT
  u.IdUsuario,
  u.Cedula,
  u.Nombre + ' ' + u.Apellido AS Usuario,
  u.Correo,
  u.Estado,
  u.FechaRegistro,
  COUNT(DISTINCT cb.IdCuentaBanco) AS TotalCuentas,
  COUNT(DISTINCT s.IdServicio) AS TotalServicios,
  COUNT(DISTINCT p.IdPago) AS TotalPagos,
  ISNULL(SUM(cb.Saldo),0) AS SaldoTotalCuentas,
  ISNULL(SUM(p.Monto),0) AS MontoTotalPagado
FROM dbo.Usuarios u
LEFT JOIN dbo.CuentasBanco cb ON cb.IdUsuario = u.IdUsuario
LEFT JOIN dbo.Servicios s ON s.IdUsuario = u.IdUsuario
LEFT JOIN dbo.Pagos p ON p.IdServicio = s.IdServicio
GROUP BY
  u.IdUsuario, u.Cedula, u.Nombre, u.Apellido, u.Correo, u.Estado, u.FechaRegistro;
GO

CREATE OR ALTER VIEW dbo.vw_Admin_RankingUsuariosPagos AS
SELECT TOP (100) PERCENT
  u.IdUsuario,
  u.Nombre + ' ' + u.Apellido AS Usuario,
  COUNT(p.IdPago) AS CantPagos,
  ISNULL(SUM(p.Monto),0) AS MontoPagado
FROM dbo.Usuarios u
LEFT JOIN dbo.Servicios s ON s.IdUsuario = u.IdUsuario
LEFT JOIN dbo.Pagos p ON p.IdServicio = s.IdServicio
GROUP BY u.IdUsuario, u.Nombre, u.Apellido
ORDER BY MontoPagado DESC, CantPagos DESC;
GO

CREATE OR ALTER VIEW dbo.vw_Admin_SaldoPorBanco AS
SELECT
  cb.NombreBanco,
  COUNT(*) AS TotalCuentas,
  SUM(CASE WHEN cb.Estado = 1 THEN 1 ELSE 0 END) AS CuentasActivas,
  SUM(CASE WHEN cb.Estado = 0 THEN 1 ELSE 0 END) AS CuentasInactivas,
  ISNULL(SUM(cb.Saldo),0) AS SaldoTotal
FROM dbo.CuentasBanco cb
GROUP BY cb.NombreBanco;
GO

CREATE OR ALTER VIEW dbo.vw_Admin_ServiciosResumen AS
SELECT
  s.TipoPeriodo,
  COUNT(*) AS TotalServicios,
  SUM(CASE WHEN s.Estado = 1 THEN 1 ELSE 0 END) AS ServiciosActivos,
  SUM(CASE WHEN s.Estado = 0 THEN 1 ELSE 0 END) AS ServiciosInactivos,
  ISNULL(SUM(s.Precio),0) AS TotalPrecio
FROM dbo.Servicios s
GROUP BY s.TipoPeriodo;
GO

CREATE OR ALTER VIEW dbo.vw_Admin_PagosPorMetodo AS
SELECT
  p.MetodoPago,
  COUNT(*) AS TotalPagos,
  ISNULL(SUM(p.Monto),0) AS MontoTotal,
  SUM(CASE WHEN p.IdCuentaBanco IS NULL THEN 1 ELSE 0 END) AS PagosSinCuenta,
  SUM(CASE WHEN p.IdCuentaBanco IS NOT NULL THEN 1 ELSE 0 END) AS PagosConCuenta
FROM dbo.Pagos p
GROUP BY p.MetodoPago;
GO

CREATE OR ALTER VIEW dbo.vw_Admin_TransferenciasPorBanco AS
SELECT
  cb.NombreBanco,
  t.TipoTransferencia,
  COUNT(*) AS TotalTransferencias,
  ISNULL(SUM(t.Monto),0) AS MontoTotal
FROM dbo.Transferencias t
JOIN dbo.CuentasBanco cb ON cb.IdCuentaBanco = t.IdCuentaBanco
GROUP BY cb.NombreBanco, t.TipoTransferencia;
GO

CREATE OR ALTER TRIGGER dbo.trg_Roles_SetAudit ON dbo.Roles
AFTER UPDATE
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE r
       SET r.FechaActualizacion = GETDATE()
    FROM dbo.Roles r
    INNER JOIN inserted i ON i.IdRol = r.IdRol;
END;
GO

CREATE OR ALTER TRIGGER dbo.trg_Usuarios_SetAudit ON dbo.Usuarios
AFTER UPDATE
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE u
       SET u.FechaActualizacion = GETDATE()
    FROM dbo.Usuarios u
    INNER JOIN inserted i ON i.IdUsuario = u.IdUsuario;
END;
GO

CREATE OR ALTER TRIGGER dbo.trg_CuentasBanco_SetAudit ON dbo.CuentasBanco
AFTER UPDATE
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE c
       SET c.FechaActualizacion = GETDATE()
    FROM dbo.CuentasBanco c
    INNER JOIN inserted i ON i.IdCuentaBanco = c.IdCuentaBanco;
END;
GO

CREATE OR ALTER TRIGGER dbo.trg_Servicios_SetAudit ON dbo.Servicios
AFTER UPDATE
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE s
       SET s.FechaActualizacion = GETDATE()
    FROM dbo.Servicios s
    INNER JOIN inserted i ON i.IdServicio = s.IdServicio;
END;
GO

CREATE OR ALTER TRIGGER dbo.trg_Pagos_SetAudit ON dbo.Pagos
AFTER UPDATE
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE p
       SET p.FechaActualizacion = GETDATE()
    FROM dbo.Pagos p
    INNER JOIN inserted i ON i.IdPago = p.IdPago;
END;
GO

CREATE OR ALTER TRIGGER dbo.trg_Transferencias_SetAudit ON dbo.Transferencias
AFTER UPDATE
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE t
       SET t.FechaActualizacion = GETDATE()
    FROM dbo.Transferencias t
    INNER JOIN inserted i ON i.IdTransferencia = t.IdTransferencia;
END;
GO

CREATE OR ALTER TRIGGER dbo.trg_SetFechaPagoServicio
ON dbo.Servicios
AFTER INSERT
AS
BEGIN
    SET NOCOUNT ON;

    UPDATE s
       SET s.FechaPago =
            CASE
                WHEN s.TipoPeriodo = 'Mensual' THEN CONVERT(date, DATEADD(DAY, 30, s.FechaRegistro))
                WHEN s.TipoPeriodo = 'Anual'   THEN CONVERT(date, DATEADD(DAY, 365, s.FechaRegistro))
                ELSE s.FechaPago
            END
    FROM dbo.Servicios s
    INNER JOIN inserted i ON i.IdServicio = s.IdServicio;
END;
GO

CREATE OR ALTER TRIGGER dbo.trg_ActualizarSaldoPago
ON dbo.Pagos
AFTER INSERT
AS
BEGIN
    SET NOCOUNT ON;

    ;WITH x AS (
        SELECT IdCuentaBanco, SUM(Monto) AS TotalMonto
        FROM inserted
        WHERE IdCuentaBanco IS NOT NULL
        GROUP BY IdCuentaBanco
    )
    UPDATE cb
       SET cb.Saldo = cb.Saldo - x.TotalMonto
    FROM dbo.CuentasBanco cb
    INNER JOIN x ON x.IdCuentaBanco = cb.IdCuentaBanco;
END;
GO

CREATE OR ALTER TRIGGER dbo.trg_ActualizarSaldoTransferencia
ON dbo.Transferencias
AFTER INSERT
AS
BEGIN
    SET NOCOUNT ON;

    ;WITH ing AS (
        SELECT IdCuentaBanco, SUM(Monto) AS M
        FROM inserted
        WHERE TipoTransferencia = 'Ingreso'
        GROUP BY IdCuentaBanco
    ),
    egr AS (
        SELECT IdCuentaBanco, SUM(Monto) AS M
        FROM inserted
        WHERE TipoTransferencia = 'Egreso'
        GROUP BY IdCuentaBanco
    )
    UPDATE cb
       SET cb.Saldo = cb.Saldo + ISNULL(ing.M,0) - ISNULL(egr.M,0)
    FROM dbo.CuentasBanco cb
    LEFT JOIN ing ON ing.IdCuentaBanco = cb.IdCuentaBanco
    LEFT JOIN egr ON egr.IdCuentaBanco = cb.IdCuentaBanco
    WHERE ing.IdCuentaBanco IS NOT NULL OR egr.IdCuentaBanco IS NOT NULL;
END;
GO

CREATE OR ALTER TRIGGER dbo.trg_NoSaldoNegativoCuentasBanco
ON dbo.CuentasBanco
AFTER UPDATE
AS
BEGIN
    SET NOCOUNT ON;

    IF EXISTS (SELECT 1 FROM inserted WHERE Saldo < 0)
    BEGIN
        RAISERROR('El saldo de la cuenta no puede ser negativo.', 16, 1);
        ROLLBACK TRANSACTION;
        RETURN;
    END
END;
GO

CREATE OR ALTER TRIGGER dbo.trg_DesactivarServiciosUsuario
ON dbo.Usuarios
AFTER UPDATE
AS
BEGIN
    SET NOCOUNT ON;

    UPDATE s
       SET s.Estado = 0,
           s.EsAutomatico = 0
    FROM dbo.Servicios s
    INNER JOIN inserted i ON i.IdUsuario = s.IdUsuario
    INNER JOIN deleted d ON d.IdUsuario = i.IdUsuario
    WHERE d.Estado = 1 AND i.Estado = 0;
END;
GO

CREATE OR ALTER PROCEDURE dbo.sp_RegistrarUsuario
  @Cedula VARCHAR(10),
  @Nombre VARCHAR(50),
  @Apellido VARCHAR(50),
  @Correo VARCHAR(100),
  @PasswordHash VARCHAR(200),
  @FechaNacimiento DATE = NULL,
  @IdRol INT = 2
AS
BEGIN
  SET NOCOUNT ON;

  IF EXISTS (SELECT 1 FROM dbo.Usuarios WHERE Cedula = @Cedula)
    THROW 50001, 'Cedula ya registrada', 1;

  IF EXISTS (SELECT 1 FROM dbo.Usuarios WHERE Correo = @Correo)
    THROW 50002, 'Correo ya registrado', 1;

  INSERT INTO dbo.Usuarios (Cedula, Nombre, Apellido, Correo, Password, FechaNacimiento, Estado, IdRol)
  OUTPUT INSERTED.IdUsuario
  VALUES (@Cedula, @Nombre, @Apellido, @Correo, @PasswordHash, @FechaNacimiento, 1, @IdRol);
END;
GO

CREATE OR ALTER PROCEDURE dbo.sp_LoginGetUser
  @Correo VARCHAR(100)
AS
BEGIN
  SET NOCOUNT ON;

  SELECT TOP 1
    IdUsuario,
    Password AS PasswordHash,
    Estado
  FROM dbo.Usuarios
  WHERE Correo = @Correo;
END;
GO

CREATE OR ALTER PROCEDURE dbo.sp_ActualizarPerfilUsuario
  @IdUsuario INT,
  @Nombre VARCHAR(50),
  @Apellido VARCHAR(50),
  @Celular VARCHAR(15) = NULL,
  @FechaNacimiento DATE = NULL
AS
BEGIN
  SET NOCOUNT ON;

  -- Normaliza vacíos
  IF (@Celular = '') SET @Celular = NULL;

  UPDATE dbo.Usuarios
  SET Nombre = @Nombre,
      Apellido = @Apellido,
      Celular = @Celular,
      FechaNacimiento = @FechaNacimiento
  WHERE IdUsuario = @IdUsuario;

  IF @@ROWCOUNT = 0
    THROW 50010, 'Usuario no encontrado', 1;
END;
GO

CREATE PROCEDURE dbo.sp_InsertarServicio
    @Nombre VARCHAR(100),
    @Descripcion VARCHAR(200),
    @NumeroCuenta VARCHAR(30),
    @IdUsuario INT,
    @TipoPeriodo VARCHAR(10),
    @Precio DECIMAL(10,2)
AS
BEGIN
    INSERT INTO dbo.Servicios (Nombre, Descripcion, NumeroCuenta, IdUsuario, TipoPeriodo, Estado, Precio, FechaRegistro)
    VALUES (@Nombre, @Descripcion, @NumeroCuenta, @IdUsuario, @TipoPeriodo, 1, @Precio, GETDATE());
END;
GO

CREATE PROCEDURE dbo.sp_InsertarPago
    @IdServicio INT,
    @Monto DECIMAL(10,2),
    @MetodoPago VARCHAR(50),
    @IdCuentaBanco INT = NULL,
    @Comentario VARCHAR(200) = NULL
AS
BEGIN
    INSERT INTO dbo.Pagos (IdServicio, Monto, MetodoPago, IdCuentaBanco, FechaPago, Comentario)
    VALUES (@IdServicio, @Monto, @MetodoPago, @IdCuentaBanco, GETDATE(), @Comentario);
END;
GO

CREATE PROCEDURE dbo.sp_InsertarTransferencia
    @IdCuentaBanco INT,
    @TipoTransferencia VARCHAR(10),
    @Monto DECIMAL(10,2),
    @Destinatario VARCHAR(100),
    @Comentario VARCHAR(200) = NULL
AS
BEGIN
    INSERT INTO dbo.Transferencias (IdCuentaBanco, TipoTransferencia, Monto, Destinatario, Comentario, Fecha)
    VALUES (@IdCuentaBanco, @TipoTransferencia, @Monto, @Destinatario, @Comentario, GETDATE());
END;
GO

CREATE PROCEDURE dbo.sp_ActualizarServicio
    @IdServicio INT,
    @Nombre VARCHAR(100),
    @Descripcion VARCHAR(200),
    @NumeroCuenta VARCHAR(30),
    @TipoPeriodo VARCHAR(10),
    @Estado BIT,
    @Precio DECIMAL(10,2),
    @EsAutomatico BIT
AS
BEGIN
    UPDATE dbo.Servicios
    SET Nombre = @Nombre,
        Descripcion = @Descripcion,
        NumeroCuenta = @NumeroCuenta,
        TipoPeriodo = @TipoPeriodo,
        Estado = @Estado,
        Precio = @Precio,
        EsAutomatico = @EsAutomatico
    WHERE IdServicio = @IdServicio;
END;
GO

CREATE PROCEDURE dbo.sp_ActualizarPago
    @IdPago INT,
    @Monto DECIMAL(10,2),
    @MetodoPago VARCHAR(50),
    @Comentario VARCHAR(200),
    @IdCuentaBanco INT = NULL
AS
BEGIN
    UPDATE dbo.Pagos
    SET Monto = @Monto,
        MetodoPago = @MetodoPago,
        Comentario = @Comentario,
        IdCuentaBanco = @IdCuentaBanco
    WHERE IdPago = @IdPago;
END;
GO

CREATE PROCEDURE dbo.sp_ActualizarTransferencia
    @IdTransferencia INT,
    @TipoTransferencia VARCHAR(10),
    @Monto DECIMAL(10,2),
    @Destinatario VARCHAR(100),
    @Comentario VARCHAR(200)
AS
BEGIN
    UPDATE dbo.Transferencias
    SET TipoTransferencia = @TipoTransferencia,
        Monto = @Monto,
        Destinatario = @Destinatario,
        Comentario = @Comentario
    WHERE IdTransferencia = @IdTransferencia;
END;
GO

CREATE PROCEDURE dbo.sp_EliminarServicio @IdServicio INT
AS
BEGIN
    DELETE FROM dbo.Servicios WHERE IdServicio = @IdServicio;
END;
GO

CREATE PROCEDURE dbo.sp_EliminarPago @IdPago INT
AS
BEGIN
    DELETE FROM dbo.Pagos WHERE IdPago = @IdPago;
END;
GO

CREATE PROCEDURE dbo.sp_EliminarTransferencia @IdTransferencia INT
AS
BEGIN
    DELETE FROM dbo.Transferencias WHERE IdTransferencia = @IdTransferencia;
END;
GO

CREATE PROCEDURE dbo.sp_EliminarUsuario @IdUsuario INT
AS
BEGIN
    DELETE FROM dbo.Usuarios WHERE IdUsuario = @IdUsuario;
END;
GO
