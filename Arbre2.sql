-- MySQL dump 10.19  Distrib 10.3.34-MariaDB, for debian-linux-gnu (x86_64)
--
-- Host: localhost    Database: Arbre2
-- ------------------------------------------------------
-- Server version	10.3.34-MariaDB-0ubuntu0.20.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `pb`
--

DROP TABLE IF EXISTS `pb`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `pb` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title_pb` text NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pb`
--

LOCK TABLES `pb` WRITE;
/*!40000 ALTER TABLE `pb` DISABLE KEYS */;
INSERT INTO `pb` VALUES (4,'WEB'),(11,'PHYSIQUE');
/*!40000 ALTER TABLE `pb` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `s1`
--

DROP TABLE IF EXISTS `s1`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `s1` (
  `id_s1` int(11) NOT NULL AUTO_INCREMENT,
  `title_s1` text NOT NULL,
  `ind_pb` int(11) NOT NULL,
  PRIMARY KEY (`id_s1`),
  KEY `lienpb` (`ind_pb`),
  CONSTRAINT `lienpb` FOREIGN KEY (`ind_pb`) REFERENCES `pb` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `s1`
--

LOCK TABLES `s1` WRITE;
/*!40000 ALTER TABLE `s1` DISABLE KEYS */;
INSERT INTO `s1` VALUES (4,'W1',4),(12,'W2',4),(14,'P1',11),(16,'P2',11);
/*!40000 ALTER TABLE `s1` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `s2`
--

DROP TABLE IF EXISTS `s2`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `s2` (
  `id_s2` int(11) NOT NULL AUTO_INCREMENT,
  `title_s2` text NOT NULL,
  `ind_s1` int(11) NOT NULL,
  PRIMARY KEY (`id_s2`),
  KEY `liens1` (`ind_s1`),
  CONSTRAINT `liens1` FOREIGN KEY (`ind_s1`) REFERENCES `s1` (`id_s1`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `s2`
--

LOCK TABLES `s2` WRITE;
/*!40000 ALTER TABLE `s2` DISABLE KEYS */;
INSERT INTO `s2` VALUES (10,'P11',14),(11,'W12',4),(12,'w13',4);
/*!40000 ALTER TABLE `s2` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `solutions`
--

DROP TABLE IF EXISTS `solutions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `solutions` (
  `id_sol` int(11) NOT NULL AUTO_INCREMENT,
  `text` text NOT NULL,
  `ind_s2` int(11) NOT NULL,
  PRIMARY KEY (`id_sol`),
  KEY `liens2` (`ind_s2`),
  CONSTRAINT `liens2` FOREIGN KEY (`ind_s2`) REFERENCES `s2` (`id_s2`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `solutions`
--

LOCK TABLES `solutions` WRITE;
/*!40000 ALTER TABLE `solutions` DISABLE KEYS */;
INSERT INTO `solutions` VALUES (26,'cal.pdf',11);
/*!40000 ALTER TABLE `solutions` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2022-07-22  9:42:18
