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
	assigned	timestamp,
	justification	text,	--by manager
	primary key (manager_id, request_id),
	foreign key (manager_id) references MANAGERS,
	foreign key (request_id) references REQUESTS
);

create table OWNERS (
	user_id 	bigserial primary key,
	foreign key (user_id) references USERS
);

create table PETS (
	pet_id 		bigserial primary key,
	name 		text not null, 
	type 		text not null, 
	biography 	text,
	born 		date not null, 
	death		date
);

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
	likes 		text[] not null,
	foreign key (user_id) references USERS
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
	reviewNum		integer,	--increment with trigger?
	note 			text,
	stars 			integer not null check (stars>=0 and stars<=5),
	task_id			bigserial not null,
	caretaker_id 	bigserial,
	owner_id 		bigserial not null,
	foreign key (task_id) references TASKS,
	foreign key (caretaker_id) references CARETAKERS,
	foreign key (owner_id) references OWNERS,
	primary key (caretaker_id, reviewNum)
);

-- Init data
INSERT INTO users (name, email, phone, address, password) VALUES ('saifum', 'saifum@u.nus.edu', '123456', '{"address": "pgph"}', '$2b$10$Ylwc8mZnLwD8RbZSYr3kx.6nmIHocDE4ZoH2kFwEx9BkhSW8Ucwqy') RETURNING *;
insert into caretakers (user_id, likes) values (1, '{Dog, Cat}'); 
INSERT INTO users (name, email, phone, address, password) VALUES ('jj', 'jj@u.nus.edu', '123457', '{"address": "ke7"}', '$2b$10$Ylwc8mZnLwD8RbZSYr3kx.6nmIHocDE4ZoH2kFwEx9BkhSW8Ucwqy') RETURNING *;
insert into owners (user_id) values (2); 
insert into managers (email, username, password, phone) values ('manager@u.nus.edu', 'manager', '$2b$10$Ylwc8mZnLwD8RbZSYr3kx.6nmIHocDE4ZoH2kFwEx9BkhSW8Ucwqy', '123458'); 

INSERT INTO pets (name, type, biography, born) VALUES ('Tom','Cat', 'Tom is a cat.', '2016-06-23');
INSERT INTO owns (pet_id, owner_id, since) VALUES (1, 2, '2016-06-23');

-- a Task Creation Flow
INSERT INTO services (caretaker_id, starting, ending, minWage, status) VALUES (1, '2019-04-01 20:28:32', '2019-04-01 20:28:33', 50, 1);
insert into bids (starting, ending, money, owner_id, pet_id, service_id, status) values ('2019-04-01 20:28:32', '2019-04-01 20:28:33', 60, 2, 1, 1, 2); 
insert into TASKS (bid_id) values (1); 

------TRIGGERS------------
create or replace function removeService() returns trigger as $$ 
declare isTask integer; 
begin
	-- can't remove if Task exists (i.e a successful bid exists)
	select count(*) into isTask from Bids B where B.service_id=new.service_id and status=2; 
	if isTask > 0 then raise notice 'Cannot remove as task exists.'; return null; 
	-- reject all ongoing bids 
	else UPDATE Bids SET status=0 WHERE service_id=new.service_id; return new; end if; 
end; $$ language plpgsql; 

create trigger removingService
before update on services
for each row
execute procedure removeService(); 

create or replace function placeBid()
returns trigger as $$ 
declare earliest timestamp; 
		latest timestamp; 
		preferences text[]; 
		likesType text; 
		petType text; 
		compatibility boolean;  
begin
	select starting, ending into earliest, latest from services where service_id=new.service_id;
	select likes into preferences from caretakers natural join services where service_id=new.service_id limit 1; 
	select type into petType from pets where pet_id=new.pet_id;  	
	compatibility:= false; 
	foreach likesType in array preferences
	loop
		if likesType=petType then compatibility:=true; EXIT; 
		end if; 
	end loop; 
	if new.starting < earliest then raise notice 'Starts later.'; return null; 
	elseif new.ending > latest then raise notice 'Ends earlier.'; return null; 
	elseif compatibility=false then raise notice 'Not in pet preference.'; return null; 
	elseif (select status from services where service_id=new.service_id)=2 then raise notice 'Bidding closed.'; return null; 
	else return new; end if; 
end; $$ language plpgsql; 

create trigger placingBid
before insert on Bids 
for each row
execute procedure placeBid(); 