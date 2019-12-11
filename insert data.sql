-- drop database project;
create database project;
use project;

CREATE TABLE Description 
    ( 
     Code VARCHAR (6) ,
     Num SMALLINT ,  
     Content VARCHAR (2000) , 
     Type VARCHAR (16) NOT NULL 
    );



CREATE TABLE PATIENT 
    ( 
     THC VARCHAR (6) NOT NULL , 
     First_name VARCHAR (15) , 
     Middle_Name VARCHAR (15) , 
     Last_Name VARCHAR (25) , 
     DOB DATE , 
     SSN CHAR (10) , 
     Gender CHAR (8) , 
     Phone_Number varchar (11) , 
     Email VARCHAR (128) , 
     Street_Address VARCHAR (128) , 
     City VARCHAR (25) , 
     State VARCHAR (25) , 
     Zip_code VARCHAR (25) , 
     Country VARCHAR (25) , 
     Photo BLOB , 
     Insurance VARCHAR (10) , 
     Comments VARCHAR (2000) ,
     PRIMARY KEY ( THC )
    );

-- ALTER TABLE patient ADD CONSTRAINT patient_pk PRIMARY KEY ( thc );


CREATE TABLE TFI 
    ( 
     VISIT_VISIT_ID INTEGER , 
     Sc_T SMALLINT , 
     Sc_I SMALLINT , 
     Sc_SC SMALLINT , 
     Sc_C SMALLINT , 
     Sc_SL SMALLINT , 
     Sc_A SMALLINT , 
     Sc_R SMALLINT , 
     Sc_Q SMALLINT , 
     Sc_E SMALLINT , 
     I1 SMALLINT , 
     I2 SMALLINT , 
     I3 SMALLINT , 
     SC4 SMALLINT , 
     Sc5 SMALLINT , 
     SC6 SMALLINT , 
     C7 SMALLINT , 
     C8 SMALLINT , 
     C9 SMALLINT , 
     SL10 SMALLINT , 
     SL11 SMALLINT , 
     SL12 SMALLINT , 
     A13 SMALLINT , 
     A14 SMALLINT , 
     A15 SMALLINT , 
     R16 SMALLINT , 
     R17 SMALLINT , 
     R18 SMALLINT , 
     Q19 SMALLINT , 
     Q20 SMALLINT , 
     Q21 SMALLINT , 
     Q22 SMALLINT , 
     E23 SMALLINT , 
     E24 SMALLINT , 
     E25 SMALLINT 
    );


CREATE TABLE THI 
    ( 
     VISIT_VISIT_ID INTEGER , 
     Sc_T SMALLINT , 
     Sc_F SMALLINT , 
     Sc_E SMALLINT , 
     Sc_C SMALLINT , 
     F1 SMALLINT , 
     F2 SMALLINT , 
     E3 SMALLINT , 
     F4 SMALLINT , 
     C5 SMALLINT , 
     E6 SMALLINT , 
     F7 SMALLINT , 
     C8 SMALLINT , 
     F9 SMALLINT , 
     E10 SMALLINT , 
     C11 SMALLINT , 
     F12 SMALLINT , 
     F13 SMALLINT , 
     E14 SMALLINT , 
     F15 SMALLINT , 
     E16 SMALLINT , 
     E17 SMALLINT , 
     F18 SMALLINT , 
     C19 SMALLINT , 
     F20 SMALLINT , 
     E21 SMALLINT , 
     E22 SMALLINT , 
     C23 SMALLINT , 
     F24 SMALLINT , 
     E25 SMALLINT 
    ) ;


CREATE TABLE VISIT 
    ( 
     VISIT_ID INTEGER NOT NULL AUTO_INCREMENT, 
     PATIENT_THC VARCHAR (6) NOT NULL , 
     Visit_sequence_number SMALLINT NOT NULL , 
     Visit_Date TIMESTAMP NOT NULL , 
     Problem_type VARCHAR (32) , 
     Comment_text VARCHAR (2000) , 
     Category INTEGER , 
     Protocol VARCHAR (32) , 
     Instrument VARCHAR (32) , 
     REM VARCHAR (8) , 
     Follow_up VARCHAR (32) , 
     Next_Visit DATE ,
     PRIMARY KEY ( visit_id )
    ) ;

-- ALTER TABLE visit ADD CONSTRAINT visit_pk PRIMARY KEY ( visit_id );

ALTER TABLE tfi
    add constraint tfi_visit_fk foreign key(visit_visit_id)
        references visit(visit_id)
ON delete no action 
;

ALTER TABLE thi
    add constraint thi_visit_fk foreign key(visit_visit_id)
        references visit(visit_id)
ON delete no action 
;

ALTER TABLE visit
    add constraint visit_patient_fk foreign key(patient_thc)
        references patient(thc)
ON delete no action 
;



INSERT INTO patient(THC, First_name,Last_Name,DOB,SSN,GENDER,Phone_Number,Email,Street_Address,City, Country, Photo, Insurance, Comments) VALUES (000001, 'John','Smith','1956-01-01',9136549872,'M','4083125467','John.Smith@abc.com','123 angel street','San Jose', 'USA', 'JM.jpg', 'Y', 'first patient');
INSERT INTO patient(THC, First_name,Last_Name,DOB,SSN,GENDER,Phone_Number,Email,Street_Address,City, Country, Photo, Insurance, Comments) VALUES (000002, 'Mary','Jane','1990-05-16',9139854562,'F','4086521478','Mary.Jane@abc.com','456 fall street','Santa Clara', 'USA', 'MJ.jpg', 'N', 'second patient');
INSERT INTO patient(THC, First_name,Last_Name,DOB,SSN,GENDER,Phone_Number,Email,Street_Address,City, Country, Photo, Insurance, Comments) VALUES (000003, 'Adam','Levine','1984-12-01',9165412872,'M','4083125467','John.Smith@abc.com','123 angel street','San Jose', 'USA', 'JM.jpg', 'Y', 'first patient');
INSERT INTO patient(THC, First_name,Last_Name,DOB,SSN,GENDER,Phone_Number,Email,Street_Address,City, Country, Photo, Insurance, Comments) VALUES (000004, 'Britney','Spear','1996-04-16',9165144562,'F','4086521478','Mary.Jane@abc.com','456 fall street','Santa Clara', 'USA', 'MJ.jpg', 'N', 'second patient');
INSERT INTO patient(THC, First_name,Last_Name,DOB,SSN,GENDER,Phone_Number,Email,Street_Address,City, Country, Photo, Insurance, Comments) VALUES (000005, 'Elton','John','1974-01-17',9136621572,'M','4083125467','John.Smith@abc.com','123 angel street','San Jose', 'USA', 'JM.jpg', 'Y', 'first patient');
INSERT INTO patient(THC, First_name,Middle_Name,Last_Name,DOB,SSN,GENDER,Phone_Number,Email,Street_Address,City, Country, Photo, Insurance, Comments) VALUES (000006,'May','Jill','Stark','1989-12-19',9139854562,'F','4086521478','Mary.Jane@abc.com','456 fall street','Santa Clara', 'USA', 'MJ.jpg', 'N', 'second patient');
INSERT INTO patient(THC, First_name,Last_Name,DOB,SSN,GENDER,Phone_Number,Email,Street_Address,City, Country, Photo, Insurance, Comments) VALUES (000007, 'April','Dean','1956-01-01',9112345872,'M','4083125467','John.Smith@abc.com','123 angel street','San Jose', 'USA', 'JM.jpg', 'Y', 'first patient');
INSERT INTO patient(THC, First_name,Last_Name,DOB,SSN,GENDER,Phone_Number,Email,Street_Address,City, Country, Photo, Insurance, Comments) VALUES (000008, 'June','Loop','1990-05-16',9139854562,'F','4086521478','Mary.Jane@abc.com','456 fall street','Santa Clara', 'USA', 'MJ.jpg', 'N', 'second patient');
INSERT INTO patient(THC, First_name,Last_Name,DOB,SSN,GENDER,Phone_Number,Email,Street_Address,City, Country, Photo, Insurance, Comments) VALUES (000009, 'Autumn','Doe','1956-01-01',913612372,'M','4083125467','John.Smith@abc.com','123 angel street','San Jose', 'USA', 'JM.jpg', 'Y', 'first patient');
INSERT INTO patient(THC, First_name,Last_Name,DOB,SSN,GENDER,Phone_Number,Email,Street_Address,City, Country, Photo, Insurance, Comments) VALUES (000010, 'Jack','Smith','1990-05-16',987654321,'F','4086521478','Mary.Jane@abc.com','456 fall street','Santa Clara', 'USA', 'MJ.jpg', 'N', 'second patient');
INSERT INTO patient(THC, First_name,Last_Name,DOB,SSN,GENDER,Phone_Number,Email,Street_Address,City, Country, Photo, Insurance, Comments) VALUES (000011, 'Taylor','Brown','1956-01-01',9136544562,'M','4083125467','John.Smith@abc.com','123 angel street','San Jose', 'USA', 'JM.jpg', 'Y', 'first patient');
INSERT INTO patient(THC, First_name,Middle_Name,Last_Name,DOB,SSN,GENDER,Phone_Number,Email,Street_Address,City, Country, Photo, Insurance, Comments) VALUES (000012, 'Sam','John','Green','1990-05-16',9139854562,'F','4086521478','Mary.Jane@abc.com','456 fall street','Santa Clara', 'USA', 'MJ.jpg', 'N', 'second patient');

INSERT INTO visit(PAtient_THC,visit_sequence_number,visit_date,problem_type, comment_text, category, protocol, instrument, REM, Follow_up,next_visit) VALUES (000001,1,'2019-11-25','THL', 'Tinnitus/Hyperacusis/Loss', 1, 'NONE', 'V', 'Y', 'T','2019-12-14');
INSERT INTO visit(PAtient_THC,visit_sequence_number,visit_date,problem_type, comment_text, category, protocol, instrument, REM, Follow_up,next_visit) VALUES (000003,1,'2019-11-25','T', 'Tinnitus', 1, 'NONE', 'GS', 'Y', 'E','2019-12-15');
INSERT INTO visit(PAtient_THC,visit_sequence_number,visit_date,problem_type, comment_text, category, protocol, instrument, REM, Follow_up) VALUES (000005,1,'2019-11-25','HT', 'Hearing Loss/Tinnitus', 1, 'NONE', 'GH', 'N', 'C');
INSERT INTO visit(PAtient_THC,visit_sequence_number,visit_date,problem_type, comment_text, category, protocol, instrument, REM, Follow_up,next_visit) VALUES (000010,1,'2019-11-26','THL', 'Tinnitus/Hyperacusis/Loss', 1, 'NONE', 'HA', 'Y', 'T','2019-12-14');
INSERT INTO visit(PAtient_THC,visit_sequence_number,visit_date,problem_type, comment_text, category, protocol, instrument, REM, Follow_up,next_visit) VALUES (000012,1,'2019-11-27','T', 'Tinnitus', 1, 'NONE', 'NONE', 'N', '','2019-12-16');
INSERT INTO visit(PAtient_THC,visit_sequence_number,visit_date,problem_type, comment_text, category, protocol, instrument, REM, Follow_up,next_visit) VALUES (000003,2,'2019-11-28','THL', 'Tinnitus/Hyperacusis/Loss', 1, 'NONE', 'V', 'Y', 'T','2020-01-14');


INSERT INTO description(Code, Num, Content, Type) VALUES ('F', 01, 'Difficult to concentrate?', 'THI');
INSERT INTO description(Code, Num, Content, Type) VALUES ('F', 02, 'Difficult to hear people?', 'THI');
INSERT INTO description(Code, Num, Content, Type) VALUES ('E', 03, 'Tinnitus make you angry?', 'THI');
INSERT INTO description(Code, Num, Content, Type) VALUES ('F', 04, 'Tinnitus make you confused?', 'THI');
INSERT INTO description(Code, Num, Content, Type) VALUES ('C', 05, 'Tinnitus make you feel desperate?', 'THI');
INSERT INTO description(Code, Num, Content, Type) VALUES ('E', 06, 'Do you complain a great deal about your tinnitus?', 'THI');
INSERT INTO description(Code, Num, Content, Type) VALUES ('F', 07, 'Trouble falling asleep at night?', 'THI');
INSERT INTO description(Code, Num, Content, Type) VALUES ('C', 08, 'Do you feel like you cannot escape your tinnitus?', 'THI');
INSERT INTO description(Code, Num, Content, Type) VALUES ('F', 09, 'Does tinnitus interfere with your ability to enjoy social activities?', 'THI');
INSERT INTO description(Code, Num, Content, Type) VALUES ('E', 10, 'Tinnitus make you feel frustrated?', 'THI');
INSERT INTO description(Code, Num, Content, Type) VALUES ('C', 11, 'Tinnitus make you feel like you have a terrible disease?', 'THI');
INSERT INTO description(Code, Num, Content, Type) VALUES ('F', 12, 'Tinnitus make it difficult for you to enjoy life?', 'THI');
INSERT INTO description(Code, Num, Content, Type) VALUES ('F', 13, 'Tinnitus interfere with your job or household responsibilities?', 'THI');
INSERT INTO description(Code, Num, Content, Type) VALUES ('E', 14, 'Tinnitus make you often irritable?', 'THI');
INSERT INTO description(Code, Num, Content, Type) VALUES ('F', 15, 'Tinnitus make it difficult for you to read?', 'THI');
INSERT INTO description(Code, Num, Content, Type) VALUES ('E', 16, 'Tinnitus make you upset?', 'THI');
INSERT INTO description(Code, Num, Content, Type) VALUES ('E', 17, 'Tinnitus has caused stress on your relationships with family and
friends?', 'THI');
INSERT INTO description(Code, Num, Content, Type) VALUES ('F', 18, 'Difficult to focus attention away from tinnitus and on to other things?', 'THI');
INSERT INTO description(Code, Num, Content, Type) VALUES ('C', 19, 'Do you feel you have no control over your tinnitus?', 'THI');
INSERT INTO description(Code, Num, Content, Type) VALUES ('F', 20, 'Tinnitus make you often feel tired?', 'THI');
INSERT INTO description(Code, Num, Content, Type) VALUES ('E', 21, 'Tinnitus make you feel depressed?', 'THI');
INSERT INTO description(Code, Num, Content, Type) VALUES ('E', 22, 'Tinnitus make you feel anxious?', 'THI');
INSERT INTO description(Code, Num, Content, Type) VALUES ('C', 23, 'Do you feel that you can no longer cope with your tinnitus?', 'THI');
INSERT INTO description(Code, Num, Content, Type) VALUES ('F', 24, 'Does your tinnitus get worse when you are under stress?', 'THI');
INSERT INTO description(Code, Num, Content, Type) VALUES ('E', 25, 'Does your tinnitus make you feel insecure?', 'THI');
INSERT INTO description(Code, Content, Type) VALUES ('ScF','Sc F total score function', 'THI Result');
INSERT INTO description(Code, Content, Type) VALUES ('ScE','Sc E total score emotion', 'THI Result');
INSERT INTO description(Code, Content, Type) VALUES ('ScC','Sc C total score catestrophic', 'THI Result');
INSERT INTO description(Code, Content, Type) VALUES ('ScT','Sc T sum of the above', 'THI Result');
INSERT INTO description(Code, Num, Content, Type) VALUES ('I', 01,'What percentage of your time awake were you consciously AWARE OF your tinnitus?', 'TFI');
INSERT INTO description(Code, Num, Content, Type) VALUES ('I', 02,'How STRONG or LOUD was your tinnitus?', 'TFI');
INSERT INTO description(Code, Num, Content, Type) VALUES ('I', 03,'What percentage of your time awake were you ANNOYED by your tinnitus?', 'TFI');
INSERT INTO description(Code, Num, Content, Type) VALUES ('SC', 04,'Did you feel IN CONTROL in regard to your tinnitus?', 'TFI');
INSERT INTO description(Code, Num, Content, Type) VALUES ('SC', 05,'How easy was it for you to COPE with your tinnitus?', 'TFI');
INSERT INTO description(Code, Num, Content, Type) VALUES ('SC', 06,'How easy was it for you to IGNORE your tinnitus', 'TFI');
INSERT INTO description(Code, Num, Content, Type) VALUES ('C', 07,'Your ability to CONCENTRATE?', 'TFI');
INSERT INTO description(Code, Num, Content, Type) VALUES ('C', 08,'Your ability to THINK CLEARLY?', 'TFI');
INSERT INTO description(Code, Num, Content, Type) VALUES ('C', 09,'Your ability to FOCUS ATTENTION on other things besides your tinnitus?', 'TFI');
INSERT INTO description(Code, Num, Content, Type) VALUES ('SL', 10,'How often did your tinnitus make it difficult to FALL ASLEEP or STAY ASLEEP?', 'TFI');
INSERT INTO description(Code, Num, Content, Type) VALUES ('SL', 11,'How often did your tinnitus cause you difficulty in getting AS MUCH SLEEP as you needed?', 'TFI');
INSERT INTO description(Code, Num, Content, Type) VALUES ('SL', 12,'How much of the time did your tinnitus leep you from SLEEPING as DEEPLY or as PEACEFULLY as you would have liked?', 'TFI');
INSERT INTO description(Code, Num, Content, Type) VALUES ('A', 13,'Your ability to HEAR CLEARLY?', 'TFI');
INSERT INTO description(Code, Num, Content, Type) VALUES ('A', 14,'Your ability to UNDERSTAND PEOPLE who are talking?', 'TFI');
INSERT INTO description(Code, Num, Content, Type) VALUES ('A', 15,'Your ability to FOLLOW CONSERVATIONS in a group of at meetings?', 'TFI');
INSERT INTO description(Code, Num, Content, Type) VALUES ('R', 16,'Your QUIET RESTING ACTIVITIES?', 'TFI');
INSERT INTO description(Code, Num, Content, Type) VALUES ('R', 17,'Your ability to RELAX?', 'TFI');
INSERT INTO description(Code, Num, Content, Type) VALUES ('R', 18,'Your ability to enjoy "PEACE AND QUIET"?', 'TFI');
INSERT INTO description(Code, Num, Content, Type) VALUES ('Q', 19,'Your enjoyment of SOCIAL ACTIVITIES?', 'TFI');
INSERT INTO description(Code, Num, Content, Type) VALUES ('Q', 20,'Your ENJOYMENT OF LIFE?', 'TFI');
INSERT INTO description(Code, Num, Content, Type) VALUES ('Q', 21,'Your RELATIONSHIPS With family, friends and other people', 'TFI');
INSERT INTO description(Code, Num, Content, Type) VALUES ('Q', 22,'How often do your tinnitus cause you to have difficulty performing your WORK OR OTHER TASKS, such as home maintenance, school work, or caring for children or others?', 'TFI');
INSERT INTO description(Code, Num, Content, Type) VALUES ('E', 23,'How ANXIOUS or WORRIED has your tinnitus made you feel?', 'TFI');
INSERT INTO description(Code, Num, Content, Type) VALUES ('E', 24,'How BOTHERED or UPSET have you been because of your tinnitus?', 'TFI');
INSERT INTO description(Code, Num, Content, Type) VALUES ('E', 25,'How DEPRESSED were you because of your tinnitus?', 'TFI');
INSERT INTO description(Code, Content, Type) VALUES ('I','INTRUSIVE (unpleasantness, intrusiveness, persistence)', 'TFI Result');
INSERT INTO description(Code, Content, Type) VALUES ('SC','SENSE OF CONTROL (reduced sense of control)', 'TFI Result');
INSERT INTO description(Code, Content, Type) VALUES ('C','COGNITIVE (cognitive interference)', 'TFI Result');
INSERT INTO description(Code, Content, Type) VALUES ('SL','SLEEP (sleep disturbance)', 'TFI Result');
INSERT INTO description(Code, Content, Type) VALUES ('A','AUDITORY (auditory difficulties attributed to tinnitus)', 'TFI Result');
INSERT INTO description(Code, Content, Type) VALUES ('R','RELAXATION (interference with relaxation)', 'TFI Result');
INSERT INTO description(Code, Content, Type) VALUES ('Q','QUALITY OF LIFE (QOL) (quality of life reduced)', 'TFI Result');
INSERT INTO description(Code, Content, Type) VALUES ('E','EMOTIONAL (emotional distress)', 'TFI Result');

