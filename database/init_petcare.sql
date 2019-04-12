	/* Ensure clean Database Schema 
	* Run this before running any of the other init_scripts
	*/
	drop schema if exists public CASCADE; 
	create schema public; 

	/*
	* A USER can be an OWNER or a CARETAKER
	* (i.e Covering Constraint and Overlapping Constraint satisfied)
	*/
	create table USERS (
		user_id 	bigserial primary key,
		name 		text not null,
		email 		text unique not null,
		phone 		varchar(20) unique not null,
		address 	json not null,
		password	char(60) not null,
		created 	timestamp not null default NOW()
	);

	-- <Sends> collapsed into it
	-- status: 0=unattended, 1=attending, 2=solved
	create table REQUESTS (
		request_id 		bigserial primary key,
		message 		text not null,
		status 			integer not null default 0 check (status>-1 and status<3),
		created 		timestamp not null default NOW(), 
		user_id 		bigserial not null,
		foreign key (user_id) references USERS
	);

	create table MANAGERS (
		manager_id 	bigserial primary key,
		email 		text unique not null,
		username 	text not null,
		password	char(60) not null,
		phone 		varchar(20) unique not null
	);

	create table Handles (
		manager_id 	bigserial,
		request_id 	bigserial,
		assigned	timestamp default NOW(),
		justification	text,	--by manager
		primary key (manager_id, request_id),
		foreign key (manager_id) references MANAGERS,
		foreign key (request_id) references REQUESTS
	);

	create table OWNERS (
		user_id 	bigserial primary key,
		foreign key (user_id) references USERS
	);

	create table ANIMALS (
		type text primary key 
	);

	-- <isOfType> collapsed into this
	create table PETS (
		pet_id 		bigserial primary key,
		name 		text not null, 
		type 		text not null, 
		biography 	text,
		born 		date not null default NOW(), 
		foreign key (type) references ANIMALS
	);

	-- Design consideration. Till and Owns here (instead of Pets as weak entity) because 
	-- we want the application to be able to handle pet transfers later on without losing information on the 
	-- pet. Logistics of it has to be solved later, and is beyond the scope of the module. 
	create table Owns (
		pet_id 		bigserial,
		owner_id 	bigserial,
		since 		date not null,
		till 		date,
		primary key (pet_id, owner_id),
		foreign key (pet_id) references PETS,
		foreign key (owner_id) references OWNERS(user_id)
	);

	create table CARETAKERS (
		user_id 	bigserial primary key,
		rating 		float4 not null default 0,
		foreign key (user_id) references USERS
	);

	create table Likes (
		caretaker_id 	bigserial, 
		type 			text, 
		primary key 	(caretaker_id, type), 
		foreign key (caretaker_id) references caretakers (user_id),
		foreign key (type) references ANIMALS
	);

	-- <Offers> collapsed into this
	-- status: 0=retracted, 1=available, 2=taken
	create table SERVICES (
		service_id		bigserial primary key,
		caretaker_id 	bigserial not null,
		starting 		timestamp not null,
		ending 			timestamp not null check (ending > starting),
		status 			integer not null default 1 check (status>-1 and status<3), 
		minWage			integer not null check (minWage > 0),
		foreign key (caretaker_id) references CARETAKERS
	);

	-- <Places> Collapsed into this
	-- status: 0=rejected, 1=pending, 2=success 
	create table BIDS (
		bid_id		bigserial primary key,
		money 		integer check (money>0),
		status 		integer not null default 1 check (status>-1 and status<3), 
		starting 	timestamp not null, 
		ending 		timestamp not null check (ending > starting), 
		owner_id 	bigserial not null,
		pet_id 		bigserial not null,
		service_id 	bigserial not null,
		foreign key (pet_id) references Pets,
		foreign key (owner_id) references Owners,
		foreign key (service_id) references SERVICES
	);

	-- <Creates> collapsed into this
	-- status: 1=upcoming, 2=finished
	create table TASKS (
		task_id 		bigserial primary key,
		bid_id 			bigserial not null unique,
		status 			integer not null default 1 check (status=1 or status=2),
		foreign key (bid_id) references BIDS
	);

	-- <Gives>, <Receives>, <Has> collapsed into this
	create table REVIEWS (
		reviewNum		integer,
		note 			text,
		stars 			integer not null check (stars>=0 and stars<=5),
		task_id			bigserial unique not null,
		caretaker_id 	bigserial,
		owner_id 		bigserial not null,
		foreign key (task_id) references TASKS,
		foreign key (caretaker_id) references CARETAKERS,
		foreign key (owner_id) references OWNERS,
		primary key (caretaker_id, reviewNum)
	);

	/* INIT DATA */
	-- types of animals supported
	insert into animals (type) values ('Cat'); 
	insert into animals (type) values ('Dog'); 
	insert into animals (type) values ('Hamster'); 

	-- all users have passwords 123456
	-- insert 2 caretakers
	-- CaretakerA==Saif and likes both Cats and Dogs 
	INSERT INTO users (name, email, phone, address, password) VALUES ('Saif', 'caretakerA@u.nus.edu', '81209298', '{"address": "35 PGPH"}', '$2b$10$Ylwc8mZnLwD8RbZSYr3kx.6nmIHocDE4ZoH2kFwEx9BkhSW8Ucwqy') RETURNING *;
	insert into caretakers (user_id) values (1);
	insert into likes (caretaker_id, type) values (1, 'Cat');
	insert into likes (caretaker_id, type) values (1, 'Dog');

	-- CaretakerB==JJ and likes Dogs 
	INSERT INTO users (name, email, phone, address, password) VALUES ('JunJie', 'caretakerB@u.nus.edu', '09812372', '{"address": "31 KE7"}', '$2b$10$Ylwc8mZnLwD8RbZSYr3kx.6nmIHocDE4ZoH2kFwEx9BkhSW8Ucwqy') RETURNING *;
	insert into caretakers (user_id) values (2);
	insert into likes (caretaker_id, type) values (2, 'Cat');
	insert into likes (caretaker_id, type) values (2, 'Dog'); 
	insert into likes (caretaker_id, type) values (2, 'Hamster');  

	-- insert 2 owners
	-- OwnerA=Kevin and adopts baby kitten Tom
	INSERT INTO users (name, email, phone, address, password) VALUES ('Kevin', 'ownerA@u.nus.edu', '1209382', '{"address": "625 Senja Road"}', '$2b$10$Ylwc8mZnLwD8RbZSYr3kx.6nmIHocDE4ZoH2kFwEx9BkhSW8Ucwqy') RETURNING *;
	insert into owners (user_id) values (3); 
	INSERT INTO pets (name, type, biography, born) VALUES ('Tom','Cat', 'A cute little munchkin.', '2018-12-25');
	INSERT INTO owns (pet_id, owner_id, since) VALUES (1, 3, '2019-1-1');

	--OwnerB=SingJie and has two pets (Bubba, a grown up female)
	INSERT INTO users (name, email, phone, address, password) VALUES ('Singjie', 'ownerB@u.nus.edu', '1989812', '{"address": "42 Raffles Hall"}', '$2b$10$Ylwc8mZnLwD8RbZSYr3kx.6nmIHocDE4ZoH2kFwEx9BkhSW8Ucwqy') RETURNING *;
	insert into owners (user_id) values (4); 
	INSERT INTO pets (name, type, biography, born) VALUES ('Bubba','Dog', 'The terrier looks fierce but does not bite :)', '2016-08-1');
	INSERT INTO owns (pet_id, owner_id, since) VALUES (2, 4, '2018-09-30');
	INSERT INTO pets (name, type, biography, born) VALUES ('Lola','Hamster', 'Small package, lotsa fun!', '2019-02-28');
	INSERT INTO owns (pet_id, owner_id, since) VALUES (3, 4, '2019-02-28');

	-- insert 2 managers
	insert into managers (email, username, password, phone) values ('managerA@u.nus.edu', 'Adi', '$2b$10$Ylwc8mZnLwD8RbZSYr3kx.6nmIHocDE4ZoH2kFwEx9BkhSW8Ucwqy', '1234111'); 
	insert into managers (email, username, password, phone) values ('managerB@u.nus.edu', 'CCY', '$2b$10$Ylwc8mZnLwD8RbZSYr3kx.6nmIHocDE4ZoH2kFwEx9BkhSW8Ucwqy', '1234510'); 

	-- Last weekend of March, Tom is left with Saif for 4 hours (instead of 6)
	-- and paid more than asked! 
	INSERT INTO services (caretaker_id, starting, ending, minWage, status) VALUES (1, '2019-03-30 10:00:00', '2019-03-30 17:00:00', 50, 2);
	insert into bids (starting, ending, money, owner_id, pet_id, service_id, status) values ('2019-03-30 12:00:00', '2019-03-30 16:00:00', 250, 3, 1, 1, 2); 
	insert into TASKS (bid_id, status) values (1, 2); 

	-- Offered again the next day, Singjie took it up
	INSERT INTO services (caretaker_id, starting, ending, minWage, status) VALUES (1, '2019-03-31 10:00:00', '2019-03-31 20:00:00', 50, 2);
	insert into bids (starting, ending, money, owner_id, pet_id, service_id, status) values ('2019-03-03 10:00:00', '2019-03-03 13:00:00', 150, 4, 2, 2, 2); 
	insert into TASKS (bid_id, status) values (2, 2); 

	-- JJ was working during the week, thus charged more
	INSERT INTO services (caretaker_id, starting, ending, minWage, status) VALUES (2, '2019-03-29 19:00:00', '2019-03-29 22:00:00', 100, 2);
	insert into bids (starting, ending, money, owner_id, pet_id, service_id, status) values ('2019-03-29 19:00:00', '2019-03-29 21:00:00', 200, 4, 3, 3, 2); 
	insert into TASKS (bid_id, status) values (3, 2); 

	INSERT INTO services (caretaker_id, starting, ending, minWage, status) VALUES (2, '2019-04-01 19:00:00', '2019-04-01 22:00:00', 100, 2);
	insert into bids (starting, ending, money, owner_id, pet_id, service_id, status) values ('2019-04-01 19:30:00', '2019-04-01 22:00:00', 300, 4, 2, 4, 2); 
	insert into TASKS (bid_id, status) values (4, 2);

	-- next weekend, Saif again; JJ offers service on Saturday night too this time. 
	INSERT INTO services (caretaker_id, starting, ending, minWage, status) VALUES (1, '2019-04-06 10:00:00', '2019-04-06 17:00:00', 50, 2);
	insert into bids (starting, ending, money, owner_id, pet_id, service_id, status) values ('2019-04-06 11:00:00', '2019-04-06 16:00:00', 300, 3, 1, 5, 2); 
	insert into TASKS (bid_id, status) values (5, 2); 

	INSERT INTO services (caretaker_id, starting, ending, minWage, status) VALUES (1, '2019-04-06 18:00:00', '2019-04-06 22:00:00', 75, 2);
	insert into bids (starting, ending, money, owner_id, pet_id, service_id, status) values ('2019-04-06 18:00:00', '2019-04-06 22:00:00', 400, 4, 2, 6, 2); 
	insert into TASKS (bid_id) values (6); -- Never clicked Finish Task

	INSERT INTO services (caretaker_id, starting, ending, minWage, status) VALUES (2, '2019-04-06 18:00:00', '2019-04-06 22:00:00', 125, 2);
	insert into bids (starting, ending, money, owner_id, pet_id, service_id, status) values ('2019-04-06 18:00:00', '2019-04-06 22:00:00', 400, 3, 1, 7, 2); 
	insert into TASKS (bid_id, status) values (7, 2);

	-- 2 pending tasks for caretakerA
	INSERT INTO services (caretaker_id, starting, ending, minWage, status) VALUES (1, '2019-04-13 18:00:00', '2019-04-13 20:00:00', 50, 2);
	insert into bids (starting, ending, money, owner_id, pet_id, service_id, status) values ('2019-04-13 18:30:00', '2019-04-13 19:30:00', 150, 3, 1, 8, 2); 
	insert into TASKS (bid_id, status) values (8, 1);

	-- Singjie bid, but Kevin beat her to it
	INSERT INTO services (caretaker_id, starting, ending, minWage, status) VALUES (1, '2019-04-14 10:00:00', '2019-04-14 16:00:00', 50, 2);
	insert into bids (starting, ending, money, owner_id, pet_id, service_id, status) values ('2019-04-14 10:00:00', '2019-04-14 16:00:00', 300, 4, 2, 9, 0); 
	insert into bids (starting, ending, money, owner_id, pet_id, service_id, status) values ('2019-04-14 10:00:00', '2019-04-14 16:00:00', 320, 3, 1, 9, 2); 
	insert into TASKS (bid_id, status) values (10, 1); 

	-- 1 available services for caretakerA (2 pending bids); same time careTakerB is offering but only 1 bid
	-- Both Kevin and SJ going to the same party, and both JJ and Saif were not invited? 
	INSERT INTO services (caretaker_id, starting, ending, minWage, status) VALUES (1, '2019-04-20 18:00:00', '2019-04-20 21:00:00', 65, 1);
	INSERT INTO services (caretaker_id, starting, ending, minWage, status) VALUES (2, '2019-04-20 18:00:00', '2019-04-20 21:00:00', 70, 1);
	insert into bids (starting, ending, money, owner_id, pet_id, service_id, status) values ('2019-04-20 18:30:00', '2019-04-20 20:30:00', 150, 3, 1, 10, 1); 
	insert into bids (starting, ending, money, owner_id, pet_id, service_id, status) values ('2019-04-20 18:30:00', '2019-04-20 20:30:00', 200, 4, 2, 10, 1);
	insert into bids (starting, ending, money, owner_id, pet_id, service_id, status) values ('2019-04-20 18:30:00', '2019-04-20 20:30:00', 200, 4, 2, 11, 1);

	-- user requests 
	insert into requests (user_id, message, status) values (2, 'Can we have more pet options, please?', 1);
	insert into handles (manager_id, request_id) values (1, 1);
	insert into requests (user_id, message) values (3, '*insert generic complaint by Kevin*');

	------TRIGGERS------------
	create or replace function updateService() returns trigger as $$ 
	declare isTask integer; 
	begin
		select count(*) into isTask from Bids B where B.service_id=new.service_id and status=2; 
		if isTask > 0 and new.status=0 then raise exception 'Cannot remove as task exists.'; return null;  
		elseif isTask > 0 and new.status=2 then raise exception 'Task already exists for this service'; return null;  
		else return new; end if; 
	end; $$ language plpgsql; 

	create trigger updatingService
	before update on services
	for each row
	execute procedure updateService(); 

	create or replace function placeBid()
	returns trigger as $$ 
	declare earliest timestamp; 
			latest timestamp; 
			minPerHour integer;  
			preferences text[]; 
			petType text; 
			compatibility boolean;  
	begin
		select starting, ending, minwage into earliest, latest, minPerHour from services where service_id=new.service_id;
		select type into petType from pets P where P.pet_id=new.pet_id; 
		if new.starting < earliest then raise exception 'Starts later.'; return null; 
		elseif new.ending > latest then raise exception 'Ends earlier.'; return null; 
		elseif (petType not in (select type from likes where caretaker_id=(select caretaker_id from Services where service_id=new.service_id))) then raise exception 'Not compatible with this pet!'; return null; 
		elseif minPerHour * ((EXTRACT(EPOCH FROM new.ending) - EXTRACT(EPOCH FROM new.starting))/3600.0) > new.money then raise exception 'Need higher offer.'; return null; 
		elseif (select status from services where service_id=new.service_id)=2 then raise exception 'Bidding closed.'; return null; 
		else return new; end if; 
	end; $$ language plpgsql; 

	create trigger placingBid
	before insert on Bids 
	for each row
	execute procedure placeBid(); 

	create or replace function offerService() 
	returns trigger as $$ 
	declare oldStart timestamp; oldEnd timestamp; 
	begin
		for oldStart, oldEnd in select starting, ending from services where caretaker_id=new.caretaker_id and status<>0
		loop
			if new.starting >= oldStart and new.starting <= oldEnd then raise exception 'Taken/Available service exists with time overlap.'; return null; 
			elseif new.ending >= oldStart and new.ending <= oldEnd then raise exception 'Taken/Available service exists with time overlap.'; return null;
			elseif new.starting <= oldStart and new.ending >= oldEnd then raise exception 'Taken/Available service exists with time overlap.'; return null;
			else return new; 
			end if; 
		end loop; 
		return new; 
	end; $$ language plpgsql; 

	create trigger offeringService 
	before insert on services
	for each row
	execute procedure offerService(); 

	create or replace function sendReview() 
	returns trigger as $$ 
	declare lastNum integer; endTime timestamp; 
	begin 
		select coalesce(max(reviewnum), 0) into lastNum from reviews where caretaker_id=new.caretaker_id; 
		select ending into endTime from tasks natural join bids where task_id=new.task_id; 
		if endTime > NOW() then raise exception 'Wait till the task is over to send review.'; return null; 
		else new.reviewnum = lastNum+1; return new; 
		end if;
	end; $$ language plpgsql;

	create trigger sendingReview
	before insert on Reviews 
	for each row 	
	execute procedure sendReview(); 

	create or replace function deleteTask()
	returns trigger as $$ begin 
		if (select ending from Bids where bid_id=old.bid_id) < NOW() then raise exception 'Cant delete if task is finished'; return null; 
		elseif old.status=2 then raise exception 'Cant delete as task is finished.'; return null; 
		else return old; end if; 
	end; $$ language plpgsql; 

	create trigger deletingTask
	before delete on Tasks
	for each row
	execute procedure deleteTask(); 

	create or replace function finishTask()
	returns trigger as $$ begin 
		if new.status=2 and (select ending from Bids where bid_id=old.bid_id) > NOW() then raise exception 'Wait till the task is over!'; return null; 
		else return new; end if; 
	end; $$ language plpgsql; 

	create trigger finishingTask
	before Update on Tasks
	for each row
	execute procedure finishTask(); 

	-- more init data 
	-- Reviews could be denormalized further, but we did not want for performance reasons. 
	INSERT INTO Reviews (stars, note, task_id, caretaker_id, owner_id) VALUES (5, 'Tom was sleeping when I got there.', 1, 1, 3);
	INSERT INTO Reviews (stars, note, task_id, caretaker_id, owner_id) VALUES (4, 'Keep it up!', 2, 1, 4);
	INSERT INTO Reviews (stars, note, task_id, caretaker_id, owner_id) VALUES (4.7, 'Well done', 4, 2, 4);
	UPDATE Caretakers SET rating=((select sum(stars)::float4 from reviews where caretaker_id=1)/(select count(*) from reviews where caretaker_id=1)) where user_id=1;
	UPDATE Caretakers SET rating=((select sum(stars)::float4 from reviews where caretaker_id=2)/(select count(*) from reviews where caretaker_id=2)) where user_id=2;

