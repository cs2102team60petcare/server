drop table if exists ADMINS cascade;
drop table if exists MANAGERS cascade;
drop table if exists USERS cascade;
drop table if exists OWNERS cascade;
drop table if exists CARETAKERS cascade;
drop table if exists PETS cascade;
drop table if exists OWNS cascade;
drop table if exists REQUESTS cascade;
drop table if exists SENDS cascade;
drop table if exists HANDLES cascade;
drop table if exists SERVICES cascade;
drop table if exists BIDS cascade;
drop table if exists TASKS cascade;
drop table if exists REVIEWS cascade;

create table MANAGERS (
	manager_id 	bigserial primary key,
	email 		text unique not null,
	username 	text not null,
	password	char(60) not null,
	phone 		varchar(20) unique not null
);

create table USERS (
	user_id 	bigserial primary key,
	name 		text not null,
	email 		text unique not null,
	phone 		varchar(20) unique not null,
	address 	json not null,
	password	char(60) not null,
	created 	timestamp not null
);

create table OWNERS (
	user_id 	bigserial primary key,
	foreign key (user_id) references USERS
);

create table CARETAKERS (
	user_id 	bigserial primary key,
	rating 		float4 not null check (rating >= 0),
	likes 		text[] not null,
	foreign key (user_id) references USERS
);

create table PETS (
	pet_id 		bigserial primary key,
	owner_id 	bigserial not null,
	type 		text not null, 
	biography 	text,
	born 		date not null, 
	since 		date not null, 
	till 		date
	foreign key (owner_id) references OWNERS(user_id)
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

-- <Sends> collapsed into it
create table REQUESTS (
	request_id 		bigserial primary key,
	message 		text not null,
	status 			integer not null,
	created 		timestamp not null, 
	user_id 		bigserial not null,
	foreign key (user_id) references USERS
);

create table Handles (
	manager_id 	bigserial,
	request_id 	bigserial,
	assigned	timestamp,
	justification	text,	--by manager
	primary key (manager_id, request_id),
	foreign key (manager_id) references MANAGER,
	foreign key (request_id) references REQUESTS
);

-- <Offers> collapsed into this
create table SERVICES (
	service_id		bigserial primary key,
	caretaker_id 	bigserial not null,
	starting 		timestamp not null,
	ending 			timestamp not null,
	status 			text not null, 
	minWage			integer not null check (minWage > 0),
	foreign key (caretaker_id) references caretakers
);

-- <Places> collapsed into this
create table BIDS (
	bid_id		bigserial primary key,
	money 		integer not null check (money > 0),
	note		text,
	status 		integer not null, 
	pet_id 		bigserial not null,
	owner_id 	bigserial not null,
	service_id 	bigserial not null,
	foreign key (pet_id) references PETS,
	foreign key (owner_id) references OWNERS,
	foreign key (service_id) references SERVICES
);


-- <Creates> collapsed into this
create table TASKS (
	task_id 	bigserial primary key,
	status 		integer not null,
	bid_id 		bigserial not null,
	foreign key (bid_id) references BIDS
);

-- <Gives>, <Receives>, <Has> collapsed into this
create table Reviews (
	reviewNum		integer not null check (reviewNum > 0),
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
