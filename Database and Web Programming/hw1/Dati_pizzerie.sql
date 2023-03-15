INSERT INTO Pizza(ID, Nome, Immagine)
VALUES
	(1, 'Margherita', "images/margherita.jpg"),
	(2, 'Biancaneve', "images/biancaneve.jpg"),
	(3, 'Capricciosa', "images/capricciosa.jpg"),
	(4, 'Norma', "images/norma.jpg"),
	(5, 'Pistacchio', "images/pistacchio.jpg"),
	(6, 'Diavola', "images/diavola.jpg"),
	(7, 'Romana', "images/romana.jpg"),
	(8, 'Parmigiana', "images/parmigiana.jpg"),
	(9, 'Quattro formaggi', "images/quattro_formaggi.jpg"),
	(10, 'Patapizza', "images/patapizza.jpg");
	

INSERT INTO Menu(ID, Num_pizze)
VALUES
	(1, NULL),
	(2, NULL),
	(3, NULL),
	(4, NULL),
	(5, NULL),
	(6, NULL),
	(7, NULL),
	(8, NULL);

INSERT INTO Possiede(Menu, Pizza, Prezzo)
VALUES
	(1, 1, 6.50),
	(1, 2, 7.50),
	(1, 3, 8),
	(2, 1, 6),
	(2, 10, 7),
	(3, 1, 5.50),
	(3, 3, 9),
	(3, 4, 6),
	(3, 5, 7.50),
	(4, 4, 6.50),
	(4, 6, 7.90),
	(4, 8, 10),
	(5, 2, 4),
	(5,7, 8.90),
	(5, 9, 11),
	(6, 7, 12);

INSERT INTO Pizzeria(ID, Nome, Immagine, Descrizione, Apertura, Indirizzo, Menu, Eta, Sconto)
VALUES
	(1, "Pizzeria la Pace", "images/pippo's.jpg", "La pizzeria più fashion della città", '2010-03-15', "Via Milano 120", 1, NULL, NULL),
	(2, "Pippo's", "images/pizzeria_2.jpg", "Pippo's è la più antica pizzeria di Catania", '2008-09-17', "Via Firenze 77", 2, NULL, NULL),
	(3, "Da Giuseppe", "images/pizzeria_3.jpg", "Vieni a provare l'inimitabile pizza di compare Giuseppe", '2001-11-18', "Via Leucatia 58", 3, NULL, NULL),
	(4, "1000 Gradi", "images/pizzeria_4.jpg", "Vieni, mangia e fai un giro in centro!", '1990-04-26', "Lungomare 170", 4, NULL, NULL),
	(5, "Pizzeria 1 cereale", "images/pizzeria_5.jpg", "Prodotti rigorosamente biologici e impasti ad alta digeribilità", '1982-12-04', "Via Messina 97", 5, NULL, NULL),
	(6, "10elode", "images/pizzeria_6.jpg", "L'unica con la pizza da 10 e lode", '2015-10-17', "Via Napoli 89", 6, NULL, NULL),
	(7, "Don Carmelo", "images/pizzeria_7.jpg", "Tradizione e gusto solo da Don Carmelo", '1985-06-15', "Via Trieste 14", 7, NULL, NULL),
	(8, "Seaside", "images/pizzeria_8.jpg", "Gustati la miglior pizza con un panorama mozzafiato", '1999-06-15', "Via Genova 51", 8, NULL, NULL);
	
INSERT INTO Ingrediente(Codice, Nome)
VALUES
	(1, 'Pomodoro'),
	(2, 'Mozzarella'),
	(3, "Prosciutto cotto"),
	(4, 'Funghi'),
	(5, 'Olive'),
	(6, "Crema di Pistacchio"),
	(7, 'Pistacchio'),
	(8, "Salame Piccante"),
	(9, 'Acciughe'),
	(10, "Patatine Fritte"),
	(11, "Wurstel"),
	(12, "Melanzane"),
	(13, "Ricotta salata"),
	(14, "Gorgonzola"),
	(15, "Fontina"),
	(16, "Grana");

INSERT INTO Composizione(Pizza, Ingrediente)
VALUES
	(1, 1),
	(1, 2),
	(2, 2),
	(3, 1),
	(3, 2),
	(3, 3),
	(3, 4),
	(3, 5),
	(4, 1),
	(4, 2),
	(4, 12),
	(4, 13),
	(5, 2),
	(5, 6),
	(5, 7),
	(6, 1),
	(6, 2),
	(6, 8),
	(7, 1),
	(7, 2),
	(7, 9),
	(8, 1),
	(8, 2),
	(8, 12),
	(8, 13),
	(9, 2),
	(9, 14),
	(9, 15),
	(9,16),
	(10, 1),
	(10, 2),
	(10, 10),
	(10, 11);

