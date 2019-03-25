-- Saifum: Think about checking constraints on each column
-- Saifum: CareTakers.likes may be a better weak entity
-- Saifum: Pets.type seem to be the same weak entity too
-- Saifum: Do we need trigger to ensure Total participation on Pets=>Owns?
-- Saifum: Request.status needs some rigid types
-- Saifum: What is the point of Sends and HandledBy?
--		   Can't we collapse all to Requests?
-- Saifum: Owners Total participation how?
-- Saifum: Note that Services is not a weak entity anymore

drop table if exists admins cascade;
drop table if exists users cascade;
drop table if exists owners cascade;
drop table if exists caretakers cascade;
drop table if exists pets cascade;
drop table if exists owns cascade;
drop table if exists requests cascade;
drop table if exists sends cascade;
drop table if exists handles cascade;
drop table if exists services cascade;
drop table if exists bids cascade;
drop table if exists tasks cascade;
drop table if exists reviews cascade;

create table Admins (
	admin_id 	bigserial primary key,
	email 		text unique not null,
	username 	text not null,
	password	char(60) not null,
	phone 		varchar(20) unique not null
);

create table Users (
	user_id 	bigserial primary key,
	name 		text not null,
	email 		text unique not null,
	phone 		varchar(20) unique not null,
	address 	json not null,
	password	char(60) not null,
	created 	timestamp not null
);

create table Owners (
	user_id 	bigserial primary key,
	-- rating 		float4 not null check (rating>0),
	foreign key (user_id) references Users
);

create table CareTakers (
	user_id 	bigserial primary key,
	rating 		float4 not null check (rating>0),
	likes 		text[],   -- trigger
	foreign key (user_id) references Users
);

-- Saifum: Doing a trigger might be slower
--		   But it'll ensure we can keep Owns separate
-- 		   Pets can be easily transferred, with us having the record/history
create table Pets (
	pet_id 		bigserial primary key,
	owner_id 	bigserial not null,
	-- rating 		float4 not null check (rating>0),
	type 		text,  -- trigger
	description text,
	ageInMonths integer check (ageInMonths>0),
	foreign key (owner_id) references Owners
);

-- need a trigger
create table Owns (
	pet_id 		bigserial,
	owner_id 	bigserial,
	since 		date not null,
	till 		date,
	primary key (pet_id, owner_id),
	foreign key (pet_id) references Pets,
	foreign key (owner_id) references Owners
);

-- trigger to check if it has been test
create table Requests (
	request_id 		bigserial primary key,
	message 		text not null,
	status 			integer not null,
	justification	text	--by admin
);

create table Sends (
	user_id 	bigserial,
	request_id 	bigserial,
	created 	timestamp not null,
	primary key (user_id, request_id),
	foreign key (user_id) references Users,
	foreign key (request_id) references requests
);

create table Handles (
	admin_id 	bigserial,
	request_id 	bigserial,
	assigned	timestamp,
	primary key (admin_id, request_id),
	foreign key (admin_id) references admins,
	foreign key (request_id) references requests
);

create table Services (
	service_id		bigserial primary key,
	caretaker_id 	bigserial,
	starting 		timestamp not null,
	ending 			timestamp not null,
	status 			text, 		-- enforce some enum
	minWage			integer check (minWage>0),
	foreign key (caretaker_id) references caretakers
	on delete cascade
);

-- How to ensure total participation?
-- Saifum: I just put the unnamed Relationship here.
--		   Is this okay?
create table Bids (
	bid_id		bigserial primary key,
	money 		integer check (money>0),
	note		text,
	success 	integer, check (success=0 or success=1 or success=2), -- one of 3 (PENDING, SUCCESS, FAIL)
	pet_id 		bigserial not null,
	owner_id 	bigserial not null,
	service_id 	bigserial not null,
	foreign key (pet_id) references Pets,
	foreign key (owner_id) references Owners,
	foreign key (service_id) references Services
	-- check (pet_id, owner_id, service_id) unique,
	-- how to check that pet_id and owner_id are a valid current partnership in Owns?
);

-- How to ensure at most 1 successful bid (AND exactly same number of task) (per service)
-- another relationship bites the dust? (tasks=>[]<-bids)
create table Tasks (
	task_id 	bigserial primary key,
	status 		integer not null, -- ensure one of pre-decided enum
	bid_id 		bigserial not null, -- check if successful
	foreign key (bid_id) references Bids
);

-- one way reviews from owners to caretakers
create table reviews (
	reviewNum		integer not null check (reviewNum>0),
	note 			text,
	stars 			integer not null check (stars>=0 and stars<=5),
	task_id			bigserial not null,
	caretaker_id 	bigserial,
	owner_id 		bigserial not null,
	foreign key (task_id) references Tasks,
	foreign key (caretaker_id) references caretakers,
	foreign key (owner_id) references owners,
	primary key (caretaker_id, reviewNum)
);
