module.exports = {
  /* ACCESS RELATED QUERIES */
  loginQuery: 'SELECT user_id, name , email, password FROM users WHERE email=$1;', // used for login
  loginManagerQuery: 'SELECT manager_id, email, password FROM MANAGERS where email=$1;',
  deserializeUserQuery: 'SELECT user_id, name, email  FROM users WHERE user_id=$1;', // used for sessions
  deserializeManagerQuery: 'select * from managers where email=$1;',
  isOwnerOrCaretakerQuery: 'SELECT 1 from OWNERS natural join USERS where email=$1 UNION SELECT 2 from CARETAKERS natural join USERS where email=$1;',

  userExistsQuery: 'SELECT user_id FROM users WHERE email=$1;', // todo: @ jj used as check before signup

  // WARNING: Use signUpUserInsert in a Transaction with one of the next two
  signupUserInsert: 'INSERT INTO users (name, email, phone, address, password) VALUES ($1, $2, $3, $4, $5) RETURNING *;',

  signupOwnerInsert: 'INSERT INTO owners (user_id) VALUES ($1);',

  signupCareTakerInsert: 'INSERT INTO caretakers (user_id) VALUES ($1);',
  careTakerLikesInsert: 'INSERT INTO likes (caretaker_id, type) VALUES ($1, $2);',
  careTakerLikesRemove: 'DELETE FROM likes where caretaker_id=$1;',


  // WARNING: Use signupPetInsert with the next query in a transaction
  signupPetInsert: 'INSERT INTO pets (name, type, biography, born) VALUES ($1, $2, $3, $4) RETURNING *;',
  ownsPetInsert: 'INSERT INTO owns (pet_id, owner_id, since) VALUES ($1, $2, $3);',

  /* PROFILE RELATED QUERIES */
  fullUserProfileQuery: 'SELECT user_id, name, email, phone, address, created FROM users where user_id=$1;',
  petProfileQuery: 'SELECT * from PETS where pet_id=$1;',

  userProfileUpdate: 'UPDATE Users SET name=$1, email=$2, phone=$3, address=$4 WHERE user_id=$5 RETURNING *;',
  // WARNING: Make sure Password is hashed with bcrypt when updating
  userPasswordUpdate: 'UPDATE Users SET password=$1 WHERE user_id=$2;',

  petProfileUpdate: 'UPDATE Pets SET name=$1, biography=$2 WHERE pet_id=$3;',

  getMyUpcomingTasksQuery: 'SELECT task_id, P.type, P.name as petname, U.name as ownername, U.phone, B.starting, B.ending, B.money FROM Tasks T JOIN Bids B on (T.bid_id=B.bid_id) JOIN Services S on (B.service_id=S.service_id) NATURAL JOIN Caretakers C NATURAL JOIN Pets P JOIN Users U on (B.owner_id=U.user_id) WHERE C.user_id=$1 and T.status=1 ORDER BY S.starting desc;',
  getMyTaskHistoryQuery: 'SELECT task_id, P.type, P.name as petname, U.name as ownername, B.starting, B.ending, B.money FROM Tasks T join Bids B on (T.bid_id=B.bid_id) join Services S on (B.service_id=S.service_id) JOIN Caretakers C on (S.caretaker_id=C.user_id) NATURAL JOIN Pets P JOIN Users U on (B.owner_id=U.user_id) WHERE C.user_id=$1 and T.status=2 ORDER BY S.starting desc;',
  getMyTaskHistoryAsOwnerQuery: 'SELECT task_id, T.status, P.name as petname, U.name as caretakername, U.phone, B.starting, B.ending, B.money FROM Tasks T join Bids B on (T.bid_id=B.bid_id and B.owner_id=$1) join Services S on (B.service_id=S.service_id) JOIN Caretakers C on (S.caretaker_id=C.user_id) NATURAL JOIN Pets P JOIN Users U on (S.caretaker_id=U.user_id) ORDER BY S.starting desc;',
  finishTaskUpdate: 'UPDATE Tasks SET status=2 where task_id=$1;',
  getMyReviews: 'SELECT * from REVIEWS where caretaker_id=$1 order by reviewnum desc;',

  getMyPetsQuery: 'SELECT * FROM Pets P NATURAL JOIN Owns O WHERE O.owner_id=$1;',

  // Use when Caretaker is offering new service
  // Note: One task per service, even if the caretaker has free time.
  // Triggers offeringService
  offerServiceInsert: 'INSERT INTO services (caretaker_id, starting, ending, minWage) VALUES ($1, $2, $3, $4);',

  serviceHistoryQuery: 'SELECT S.service_id, T.task_id, S.status, S.starting, S.ending, T.status, S.minWage, B.money, B.owner_id, B.pet_id ' +
        'FROM Services S LEFT OUTER JOIN (Bids B join Tasks T on B.bid_id=T.bid_id) on S.caretaker_id=$1 and (B.service_id=S.service_id) ' +
        'ORDER BY (starting) OFFSET $2 LIMIT $3;',
  getMyAvailableServicesQuery: 'SELECT * FROM SERVICES WHERE caretaker_id=$1 and status=1;',

  /* BIDS RELATED QUERIES */
  getPendingBidsForMeQuery: 'select B.bid_id, S.service_id, P.type, U.name, B.starting, B.ending, B.money ' +
        'from caretakers C join services S on (C.user_id=S.caretaker_id) join Bids B on (B.service_id=S.service_id) ' +
        'join Pets P on (B.pet_id=P.pet_id) join Users U on (B.owner_id=U.user_id) ' +
        'where S.status=1 and B.status=1 and S.caretaker_id=$1;',
  seeBidsForServiceQuery: 'SELECT B.owner_id, B.status, B.bid_id, S.service_id, B.money, B.starting, B.ending FROM Bids B JOIN Services S on (B.service_id=S.service_id) ' +
        'WHERE S.service_id=$1 ORDER BY B.money desc;',
  seeMyBidsQuery: 'SELECT B.bid_id, B.pet_id, B.service_id, B.money, B.status, U.name, B.starting, B.ending FROM Bids B JOIN Services S on (B.service_id=S.service_id) join Users U on (U.user_id=S.caretaker_id) where B.owner_id=$1;',
  getAllBids: 'SELECT * FROM Bids',
  // Triggers placingBid
  placeBidInsert: 'INSERT INTO Bids (starting, ending, money, owner_id, pet_id, service_id) VALUES ($1, $2, $3, $4, $5, $6);',

  // Use when Caretaker is removing a service (can't do it if already a task)
  // NOTE: triggers updateService
  removeServiceUpdate1: 'UPDATE Services SET status=0 WHERE service_id=$1;',
  removeServiceUpdate2: 'UPDATE Bids SET status=0 WHERE service_id=$1;',

  /* REQUEST or SUPPORTTICKET RELATED QUERIES */
  sendRequestInsert: 'INSERT INTO Requests (message, user_id) VALUES ($1, $2);',
  getUnassignedRequests: 'SELECT * FROM Requests WHERE status=0;',
  getSolvedRequestsAssignedToMe: 'SELECT * FROM Requests NATURAL JOIN Handles WHERE manager_id=$1 and status=2 ORDER by status OFFSET $2 LIMIT $3;',
  getUnresolvedRequestsAssignedToMe: 'SELECT * FROM Requests NATURAL JOIN Handles WHERE manager_id=$1 and status=1 ORDER by status OFFSET $2 LIMIT $3;',
  getRequestsAssignedToMeWithFilters: 'SELECT * FROM Requests NATURAL JOIN Handles WHERE manager_id=$1 and request_id=$2;',

  rejectBidUpdate: 'UPDATE Bids SET status=0 WHERE bid_id=$1;',

  // Trigger sendReview()
  sendReviewInsert1: 'INSERT INTO Reviews (stars, note, task_id, caretaker_id, owner_id) VALUES ($1, $2, $3, $4, $5);',
  sendReviewInsert2: 'UPDATE Tasks set status=2 where task_id=$1;', // $1 = $3 from above
  sendReviewInsert3: 'UPDATE Caretakers SET rating=((select sum(stars)::float4 from reviews where caretaker_id=$1)/(select count(*) from reviews where caretaker_id=$1)) where user_id=$1;', // $4 = $1 from above

  taskCompletedupdate: 'UPDATE Tasks SET status=2 where task_id=$1;',

  // Use when Owners want to retract a bid (CAN do even if already a task)
  // Again, you can only remove and add bids, no edits.
  // Trigger deletingTask ensures finished tasks/bids can't be deleted (both soft and hard)
  retractBidUpdate1: 'UPDATE Bids SET status=0 WHERE owner_id=$1 and bid_id=$2;',
  retractBidUpdate2: 'UPDATE Bids SET status=1 WHERE owner_id<>$1 and service_id=$2;',
  retractBidUpdate3: 'UPDATE Services SET status=1 WHERE service_id=$1;',
  retractBidUpdate4: 'DELETE FROM Tasks where bid_id=$1;',

  // Use when caretaker accepts a bid
  // make sure no other accepted bids present
  // Triggers updateService
  acceptBidUpdate1: 'UPDATE Services SET status=2 WHERE service_id=$1;',
  acceptBidUpdate2: 'UPDATE Bids SET status=2 WHERE bid_id=$1',
  acceptBidUpdate3: 'UPDATE Bids SET status=0 WHERE bid_id<>$1 and service_id=$2;',
  acceptBidUpdate4: 'INSERT INTO Tasks (bid_id) VALUES ($1);',

  // Complex Query 1
  // Gives you the average of (average made per hour) grouped by month, for each caretaker
  // on the manager dashboard
  perHourAverageByMonthQuery: 'select S.caretaker_id, extract(month from B.starting)::integer as month, coalesce(avg(money/((EXTRACT(EPOCH FROM B.ending) - EXTRACT(EPOCH FROM B.starting))/3600.0)), 0) as money from Bids B join Tasks T on (T.bid_id=B.bid_id) join Services S on (B.service_id=S.service_id) group by S.caretaker_id, extract(month from B.starting) order by extract(month from B.starting);',

  // Complex Query 2
  // Shows the caretaker the cumulative earning (by day)
  // on the caretaker_dashboard
  perDayCumulativeSumQuery: 'select extract(year from B.starting)::integer as year, extract(month from b.starting)::integer as month, extract(day from b.starting)::integer as day, sum(sum(money)) over (order by extract(year from B.starting), extract(month from b.starting), extract(day from b.starting)) from Bids B join Tasks T on (T.bid_id=B.bid_id) join Services S on (B.service_id=S.service_id) where S.caretaker_id=$1 group by extract(year from B.starting), extract(month from b.starting), extract(day from b.starting) order by sum desc offset $2 limit $3;',

  // Complex Query 3
  // Shows the demand ratio by hour for days {1..7} (whichever we call)
  ratioOfBidsByHourByDay: 'select extract(DOW from starting) as day, extract(hour from starting)::integer as hour, ' +
        'count(*)::float4/(select count(*) from Bids where extract(DOW from starting)=$1) as ratio ' +
        'from bids where extract(DOW from starting)=$1 group by day, hour;',

  // Do inside a transaction
  assignRequestToMe1: 'UPDATE Requests SET status=1 where request_id=$1;',
  assignRequestToMe2: 'INSERT INTO Handles (manager_id, request_id) VALUES ($1, $2);',

  // Do inside a transaction
  requestSolvedUpdate1: 'UPDATE Requests SET status=2 where request_id=$1;',
  requestSolvedUpdate2: 'UPDATE Handles SET justification=$1 where request_id=$2;',

  // ----------------------- TESTED UNTIL HERE --------------------------------//

  // use the base string + other strings
  // use for the filter in the owner_home page
  // add num accordingly at the end of every non-base string (or $)
  searchAvailableServicesBase: "SELECT S.service_id, S.starting, S.ending, S.minWage, U.name, C.rating, " +
      "array_to_string(array_agg(distinct L.type), ',') as petType " + 
      "FROM SERVICES S JOIN Caretakers C on (S.caretaker_id=C.user_id) JOIN USERS U on (U.user_id=C.user_id) join Likes L on (C.user_id=L.caretaker_id) WHERE status=1 GROUP BY S.service_id, U.name, C.rating",
  serachAvailableServicesStarting: ' and S.starting>=$',
  searchAvailableServicesEnding: ' and S.ending<=$',
  searchAvailableServicesCaretaker: ' and U.name=$',
  searchAvailableServiesPetType1: ' and $',
  searchAvailableServicePetType2: '= ANY(SELECT type FROM Likes L2 where L2.caretaker_id=S.caretaker_id)',
  getCareTakerIDByName: 'SELECT C.user_id FROM caretakers C join users U on C.user_id = U.user_id where U.name = $1'
}
