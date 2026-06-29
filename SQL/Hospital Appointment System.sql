CREATE DATABASE HospitalAppointmentSystem;
USE HospitalAppointmentSystem;

CREATE TABLE Admin(
	id INT IDENTITY(1,1) PRIMARY KEY,
	username VARCHAR(50) UNIQUE NOT NULL,
	password VARCHAR(100) NOT NULL
);

CREATE TABLE Doctors(
	id VARCHAR(20) PRIMARY KEY,
	doctor_id VARCHAR(20) UNIQUE NOT NULL,
	doctor_name VARCHAR(100) NOT NULL,
	specialization VARCHAR(100) NOT NULL,
	department VARCHAR(100) NOT NULL,
	Tokens INT NOT NULL
);

CREATE TABLE Patients(
	id VARCHAR(20) PRIMARY KEY,
	firstName VARCHAR(50) NOT NULL,
	middleName VARCHAR(50),
	lastName VARCHAR(50),
	age INT NOT NULL,
	gender VARCHAR(20),
	emailID VARCHAR(100) UNIQUE NOT NULL,
	phoneNumber VARCHAR(20),
	address VARCHAR(255),
	username VARCHAR(50) UNIQUE NOT NULL,
	password VARCHAR(100) NOT NULL
);

CREATE TABLE Appointments(
	id VARCHAR(20) PRIMARY KEY,
	patientID VARCHAR(20) NOT NULL,
	doctorID VARCHAR(20) NOT NULL,
	currentUserName VARCHAR(100),
	currentUserAge INT,
	currentUserGender VARCHAR(20),
	reason VARCHAR(255),
	appointment_date DATE,
	appointment_time VARCHAR(50),
	TokenNumber INT,
	status VARCHAR(30),
	isDeleted BIT DEFAULT 0,
	createdDate DATE,
	FOREIGN KEY(patientID) REFERENCES Patients(id),
	FOREIGN KEY(doctorID) REFERENCES Doctors(id)
);

INSERT INTO Admin(username,password)
VALUES
('admin','password');

INSERT INTO Doctors
VALUES
('qVjd9TFOesY','crd230311','AsokKumar','Cardiologist','Cardiology',20),
('KokpyD7hqEo','ent291101','DavidJames','ENT consultant','ENT',20),
('YNdocJhGW0c','neu251220','SophiaPrince','Neurologist','Neurology',20);

INSERT INTO Patients
VALUES
('XSONDq9cFL4','Tegi','P','Daniel',30,'Female','tegi@gmail.com','897790278','abcd street cbe','tegi123','Tegi@123'),
('pMau_3HLxOA','Shawn','Mathew','Daniel',23,'Male','shawn@gmail.com','8899778855','abcd streert','shawn123','Shawn@123');

INSERT INTO Appointments
VALUES
('MCtyZT0K03M','XSONDq9cFL4','KokpyD7hqEo','Tegi P Daniel',30,'Female','Migrane','2026-06-30','9:30 AM - 12:30 AM',1,'Appointed',0,'2026-06-29'),
('vgaO_8t6yMs','XSONDq9cFL4','YNdocJhGW0c','Tegi P Daniel',30,'Female','High Fever','2026-07-01','9:30 AM - 12:30 AM',1,'Appointed',0,'2026-06-29'),
('ZbFMzwDyAF0','pMau_3HLxOA','qVjd9TFOesY','Shawn Mathew Daniel',23,'Male','High Fever','2026-07-01','1:30 PM - 4:30 PM',2,'Appointed',0,'2026-06-29');

CREATE VIEW AppointmentDetails
AS
SELECT
a.id,
p.firstName + ' ' + ISNULL(p.middleName + ' ','') + p.lastName AS PatientName,
d.doctor_name,
d.department,
d.specialization,
a.reason,
a.appointment_date,
a.appointment_time,
a.TokenNumber,
a.status
FROM Appointments a
JOIN Patients p
ON a.patientID = p.id
JOIN Doctors d
ON a.doctorID = d.id;

GO

CREATE VIEW ActiveAppointments
AS
SELECT *
FROM Appointments
WHERE isDeleted = 0;

GO

CREATE VIEW RequestedAppointments
AS
SELECT *
FROM Appointments
WHERE status = 'Requested';

GO

CREATE VIEW CardiologyAppointments
AS
SELECT
a.id,
d.doctor_name,
a.currentUserName,
a.appointment_date,
a.status
FROM Appointments a
JOIN Doctors d
ON a.doctorID = d.id
WHERE d.department = 'Cardiology';

GO

CREATE PROC DoctorAppointments
@doctorName VARCHAR(100)
AS
BEGIN
    SELECT *
    FROM AppointmentDetails
    WHERE doctor_name = @doctorName;
END;

GO

SELECT * FROM Doctors;

SELECT * FROM Patients;

SELECT * FROM Appointments;

SELECT * FROM AppointmentDetails;

SELECT * FROM ActiveAppointments;

SELECT * FROM RequestedAppointments;

SELECT * FROM CardiologyAppointments;

SELECT * FROM Doctors
WHERE department = 'ENT';

SELECT * FROM Doctors
WHERE specialization = 'Neurologist';

SELECT * FROM Appointments
WHERE appointment_date = '2026-07-01';

SELECT COUNT(*) AS TotalDoctors
FROM Doctors;

SELECT COUNT(*) AS TotalPatients
FROM Patients;

SELECT COUNT(*) AS TotalAppointments
FROM Appointments;

SELECT COUNT(*) AS ActiveAppointments
FROM Appointments
WHERE isDeleted = 0;

SELECT COUNT(*) AS RequestedAppointments
FROM Appointments
WHERE status = 'Requested';

SELECT department,
COUNT(*) AS TotalDoctors
FROM Doctors
GROUP BY department;

SELECT doctor_name,
COUNT(a.id) AS TotalAppointments
FROM Doctors d
LEFT JOIN Appointments a
ON d.id = a.doctorID
GROUP BY doctor_name;

SELECT currentUserName,
COUNT(*) AS TotalAppointments
FROM Appointments
GROUP BY currentUserName;

SELECT *
FROM AppointmentDetails
WHERE TokenNumber = 1;

EXEC DoctorAppointments 'AsokKumar';