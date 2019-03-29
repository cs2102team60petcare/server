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
create table REQUESTS (
	request_id 		bigserial primary key,
	message 		text not null,
	status 			integer not null default 0,
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
	rating 		float4 not null check (rating >= 0),
	likes 		text[] not null,
	foreign key (user_id) references USERS
);

-- <Offers> collapsed into this
create table SERVICES (
	service_id		bigserial primary key,
	caretaker_id 	bigserial not null,
	starting 		timestamp not null,
	ending 			timestamp not null,
	status 			integer not null default 1, 
	minWage			integer not null check (minWage > 0),
	foreign key (caretaker_id) references CARETAKERS
);

-- <Places> Collapsed into this
-- status: 0=rejected, 1=pending, 2=success 
create table BIDS (
	bid_id		bigserial primary key,
	money 		integer check (money>0),
	status 		integer not null default 1 check (status>-1 and status<3), 
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