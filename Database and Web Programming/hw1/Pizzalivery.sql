--Creazione Tabelle
CREATE TABLE Menu(
ID INTEGER PRIMARY KEY,
Num_pizze INTEGER)
Engine='InnoDB';

--Aggiunto Immagine e Descrizione; 
CREATE TABLE Pizzeria(
ID INTEGER PRIMARY KEY,
Nome VARCHAR(20),
Immagine VARCHAR(50),
Descrizione VARCHAR(400),
Apertura DATE,
Indirizzo VARCHAR(50),
Menu INTEGER NOT NULL,
Eta INTEGER,
Sconto DECIMAL(5, 1),
INDEX menu_idx(Menu),
FOREIGN KEY(Menu) REFERENCES Menu(ID))
Engine='InnoDB';

CREATE TABLE Cliente(
ID INTEGER PRIMARY KEY AUTO_INCREMENT,
Nome VARCHAR(20),
Cognome VARCHAR(20),
Email VARCHAR(50),
Username VARCHAR(20),
Password VARCHAR(20),
Indirizzo VARCHAR(50),
Cellulare VARCHAR(10))
Engine='InnoDB';

--Nuova Tabella
CREATE TABLE Preferiti(
Cliente INTEGER,
Pizzeria INTEGER,
INDEX cliente_idx(Cliente),
INDEX pizzeria_idx(Pizzeria),
FOREIGN KEY(Cliente) REFERENCES Cliente(ID),
FOREIGN KEY(Pizzeria) REFERENCES Pizzeria(ID),
PRIMARY KEY(Cliente, Pizzeria))
Engine='InnoDB';

CREATE TABLE Pizza(
ID INTEGER PRIMARY KEY,
Nome VARCHAR(20),
Immagine VARCHAR(50))
Engine='InnoDB';

CREATE TABLE Ordine_info(
ID INTEGER PRIMARY KEY AUTO_INCREMENT,
Cliente INTEGER,
Totale DECIMAL(5,2),
Data DATE,
INDEX cliente_idx(Cliente),
FOREIGN KEY(Cliente) REFERENCES Cliente(ID))
Engine='InnoDB';

CREATE TABLE Ordine(
ID INTEGER,
Pizzeria INTEGER,
Pizza INTEGER,
Prezzo DECIMAL(5,2),
Quantita INTEGER,
INDEX pizzeria_idx(Pizzeria),
INDEX pizza_idx(Pizza),
FOREIGN KEY(Pizzeria) REFERENCES Pizzeria(ID),
FOREIGN KEY(Pizza) REFERENCES Pizza(ID),
PRIMARY KEY(ID, Pizza, Pizzeria))
Engine='InnoDB';

CREATE TABLE Possiede(
Menu INTEGER,
Pizza INTEGER,
Prezzo DECIMAL(4,2),
INDEX menu_idx(Menu),
INDEX pizza_idx(Pizza),
FOREIGN KEY(Menu) REFERENCES Menu(ID),
FOREIGN KEY(Pizza) REFERENCES Pizza(ID),
PRIMARY KEY(Menu, Pizza))
Engine='InnoDB';

CREATE TABLE Ingrediente(
Codice INTEGER PRIMARY KEY,
Nome VARCHAR(20))
Engine='InnoDB';

CREATE TABLE Composizione(
Pizza INTEGER,
Ingrediente INTEGER,
INDEX pizza_index(Pizza),
INDEX ingrediente_index(Ingrediente),
FOREIGN KEY(Pizza) REFERENCES Pizza(ID),
FOREIGN KEY(Ingrediente) REFERENCES Ingrediente(Codice),
PRIMARY KEY(Pizza, Ingrediente))
Engine='InnoDB';

--Trigger
--Allinea l'attributo ridondante Eta_pizzeria
DELIMITER //
CREATE TRIGGER Eta_pizzeria
BEFORE INSERT ON Pizzeria
FOR EACH ROW
BEGIN
SET NEW.Eta=TIMESTAMPDIFF(YEAR,NEW.Apertura, CURDATE());
END //
DELIMITER ;
--select * from pizzeria;

DELIMITER //
CREATE PROCEDURE Aggiorna_eta_pizzeria()
BEGIN
UPDATE Pizzeria
SET Eta=TIMESTAMPDIFF(YEAR, Apertura, CURDATE());
END //
DELIMITER ;


--Allinea l'attributo ridondante Num_pizze
DELIMITER //
CREATE TRIGGER Num_pizze
AFTER INSERT ON Possiede
FOR EACH ROW
BEGIN
UPDATE Menu
SET Num_pizze = (SELECT count(*) FROM Possiede WHERE Possiede.Menu=New.Menu) WHERE ID=NEW.Menu;
END //
DELIMITER ;

--Allinea l'attributo ridondante prezzo
DELIMITER //
CREATE TRIGGER Calcola_prezzo
BEFORE INSERT ON Ordine
FOR EACH ROW
BEGIN
IF((SELECT Sconto FROM Pizzeria WHERE Pizzeria.ID=NEW.Pizzeria) IS NOT NULL AND (SELECT Data FROM Ordine_info WHERE ID = NEW.ID)=CURDATE()) THEN
SET NEW.Prezzo=(SELECT Prezzo FROM Possiede P WHERE P.Menu=(SELECT Menu FROM Pizzeria PZ WHERE PZ.ID=NEW.Pizzeria) AND P.Pizza=NEW.Pizza) * NEW.Quantita
*(1-((SELECT Sconto FROM Pizzeria PZ1 WHERE PZ1.ID=NEW.Pizzeria)/100));
ELSE
SET NEW.Prezzo=(SELECT Prezzo FROM Possiede P WHERE P.Menu=(SELECT Menu FROM Pizzeria PZ WHERE PZ.ID=NEW.Pizzeria) AND P.Pizza=NEW.Pizza)*NEW.Quantita;
END IF;
END //
DELIMITER ;

--Controlla che la pizza sia presente nel menu della pizzeria
DELIMITER //
CREATE TRIGGER Controlla_pizza_pizzeria
BEFORE INSERT ON Ordine
FOR EACH ROW
BEGIN
IF NOT EXISTS(SELECT * FROM Possiede P WHERE P.Menu=(SELECT Menu FROM PIZZERIA PZ WHERE PZ.ID=NEW.Pizzeria) AND P.Pizza=NEW.Pizza) THEN
Signal SQLSTATE '45000' SET MESSAGE_TEXT="La pizza non è presente nel menu della pizzeria";
END IF;
END //
DELIMITER ;

--Operazioni
--OP1
CREATE VIEW Clienti_completo AS
SELECT C.ID AS ID, C.Nome AS Nome, C.Cognome AS Cognome, P.ID AS ID_Pizza, P.Nome AS Pizza, sum(Quantita) AS Num_pizze_ordinate
FROM Cliente C LEFT JOIN Ordine_info OI ON C.ID=OI.Cliente
JOIN Ordine O ON OI.ID=O.ID
JOIN Pizza P ON O.Pizza=P.ID
GROUP BY C.ID, P.ID;


DELIMITER //
CREATE PROCEDURE OP1
(In cliente INTEGER)
BEGIN
DROP TEMPORARY TABLE IF EXISTS Pizze_pref;
CREATE TEMPORARY TABLE Pizze_pref AS
SELECT ID_Pizza, Num_pizze_ordinate FROM Clienti_completo WHERE Num_pizze_ordinate = 
(SELECT max(Num_pizze_ordinate) FROM Clienti_completo WHERE ID=cliente) AND ID=Cliente;
END //
DELIMITER ;

--OP3
DELIMITER //
CREATE PROCEDURE OP3
(IN Pizz INTEGER, IN Sc DECIMAL)
BEGIN
UPDATE Pizzeria
SET Sconto = (CASE
	WHEN (DAYNAME(CURDATE()) = 'Friday' AND Eta=10) THEN Sc*2
	WHEN(DAYNAME(CURDATE()) = 'Tuesday' AND Eta=30) THEN Sc*1.5
	ELSE
		Sc
	END)
WHERE Pizzeria.ID=Pizz;
END //
DELIMITER ;

--OP4
DELIMITER //
CREATE PROCEDURE OP4(
IN n INTEGER)
BEGIN
DROP TEMPORARY TABLE IF EXISTS Info_menu;
CREATE TEMPORARY TABLE Info_menu AS
SELECT * FROM menu M1 WHERE EXISTS(SELECT count(*) FROM menu M2 WHERE M2.num_pizze=M1.Num_pizze AND M2.id<>M1.id HAVING count(*) >= n);
END //
DELIMITER ;

