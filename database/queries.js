module.exports = {
    /* ACCESS RELATED QUERIES */
    loginQuery: "SELECT user_id, name , email, password FROM users WHERE email=$1;", //used for login
    deserializeQuery: "SELECT user_id, name  FROM users WHERE user_id=$1;", //used for sessions

    userExistsQuery: "SELECT user_id FROM users WHERE email=$1;", //todo: @ jj used as check before signup 

    //TODO: @Psyf no deletion yet. 
    // call them SOFT deletes
    //WARNING: Use signUpUserInsert in a Transaction with one of the next two 
    signupUserInsert: "INSERT INTO users (name, email, phone, address, password) VALUES ($1, $2, $3, $4, $5) RETURNING *",
    signupOwnerInsert: "INSERT INTO owners (user_id) VALUES ($1);",

    signupCareTakerInsert: "INSERT INTO caretakers (user_id) VALUES ($1);",
    careTakerLikesInsert: "INSERT INTO likes (caretaker_id, type) VALUES ($1, $2);",
    careTakerLikesRemove: "DELETE FROM likes where caretaker_id=$1 and type=$2;",

    // WARNING: Use signupPetInsert with the next query in a transaction
    signupPetInsert: "INSERT INTO pets (name, type, biography, born) VALUES ($1, $2, $3, $4);",
    ownsPetInsert: "INSERT INTO owns (pet_id, owner_id, since) VALUES ($1, $2, $3);",

    /* PROFILE RELATED QUERIES */
    fullUserProfileQuery: "SELECT user_id, name, email, phone, address, created FROM users where user_id=$1;",
    petProfileQuery: "SELECT * from PETS where pet_id=$1;",

    userProfileUpdate: "UPDATE Users SET name=$1, email=$2, phone=$3, address=$4 WHERE user_id=$1;",
    //WARNING: Make sure Password is hashed with bcrypt when updating
    userPasswordUpdate: "UPDATE Users SET password=$1 WHERE user_id=$2;",

    petProfileUpdate: "UPDATE Pets SET name=$1, biography=$2 WHERE pet_id=$3;",

    getMyUpcomingTasksQuery: "SELECT * FROM Tasks T NATURAL JOIN Services S NATURAL JOIN Caretakers C " +
        "WHERE C.user_id=$1 and T.status=1 ORDER BY S.starting desc;",
    getMyTaskHistoryQuery: "SELECT * FROM Tasks T NATURAL JOIN Services S NATURAL JOIN Caretakers C " +
        "WHERE C.user_id=$1 ORDER BY S.starting desc OFFSET $2 LIMIT $3;",

    getMyPetsQuery: "SELECT * FROM Pets P NATURAL JOIN Owns O WHERE O.owner_id=$1;",

    // Use when Caretaker is offering new service
    // Note: One task per service, even if the caretaker has free time. 
    // Triggers offeringService 
    offerServiceInsert: "INSERT INTO services (caretaker_id, starting, ending, minWage) VALUES ($1, $2, $3, $4);",

    serviceHistoryQuery: "SELECT S.service_id, T.task_id, S.status, S.starting, S.ending, T.status, S.minWage, B.money, B.owner_id, B.pet_id " +
        "FROM Services S LEFT OUTER JOIN (Bids B join Tasks T on B.bid_id=T.bid_id) on S.service_id=$1 and (B.service_id=S.service_id) " +
        "ORDER BY (starting) OFFSET $2 LIMIT $3;",

    /* BIDS RELATED QUERIES */
    seeBidsQuery: "SELECT * FROM Bids B NATURAL JOIN Services S " +
        "WHERE S.service_id=$1 ORDER BY B.money desc;",

    //Triggers placingBid
    placeBidInsert: "INSERT INTO Bids (starting, ending, money, owner_id, pet_id, service_id) VALUES ($1, $2, $3, $4, $5, $6);",

    // Use when Caretaker is removing a service (can't do it if already a task)
    // NOTE: No edits. You can remove and add again if needed.
    // NOTE: triggers removingService  
    removeServiceUpdate: "UPDATE Services SET status=0 WHERE service_id=$1;",

    /* REQUEST or SUPPORTTICKET RELATED QUERIES */
    sendRequestInsert: "INSERT INTO Requests (message, user_id) VALUES ($1, $2);",
    getUnassignedRequests: "SELECT * FROM Requests WHERE status=0;",
    getRequestsAssignedToMe: "SELECT * FROM Requests NATURAL JOIN Handles WHERE manager_id=$1 ORDER by status OFFSET $2 LIMIT $3;", 
    
    rejectBidUpdate: "UPDATE Bids SET status=0 WHERE bid_id=$1;",
    
    // Trigger sendReview()
    // TODO @ JJ This is a transaction
    sendReviewInsert1: "INSERT INTO Reviews (stars, note, task_id, caretaker_id, owner_id) VALUES ($1, $2, $3, $4, $5);",
    sendReviewInsert2: "UPDATE Tasks set status=2 where task_id=$1;",    //$1 = $3 from above  
    sendReviewInsert3: "UPDATE Caretakers SET rating=((select sum(stars)::float4 from reviews where caretaker_id=$1)/(select count(*) from reviews where caretaker_id=$1));",  //$4 = $1 from above
    
    //TODO @Psyf Trigger to ensure time 
    taskCompletedupdate: "UPDATE Tasks SET status=2 where task_id=$1;",


    //----------------------- TESTED UNTIL HERE --------------------------------//

    // use the base string + other strings
    // use for the filter in the owner_home page 
    // add num accordingly at the end of every non-base string (or $)
    searchAvailableServicesBase: "Select * from Services S " +
        "join Caretakers C on (C.user_id=S.caretaker_id) natural join Users U where status=1", 
    serachAvailableServicesStarting: " and S.starting>=$", 
    searchAvailableServicesEnding: " and S.ending<=$",  
    searchAvailableServicesCaretaker: " and U.name=$", 
    searchAvailableServiesPetType1: " and $",
    searchAvailableServicePetType2: "= ANY(SELECT type FROM Likes L2 where L2.caretaker_id=S.caretaker_id)",

    // Use when Owners want to retract a bid (CAN do even if already a task)
    // Again, you can only remove and add bids, no edits. 
    // TODO @Psyf 
    // Trigger for "UPDATE Bids SET status=1 WHERE owner_id<>$1 and bid_id=$2;" 
    // + "UPDATE Services SET status=1 WHERE service_id=$3;" 
    // + DELETE Task if this was a successful bid
    retractBidUpdate: "UPDATE Bids SET status=0 WHERE owner_id=$1 and bid_id=$2;",

    // Use when caretaker accepts a bid 
    // TODO @Psyf Trigger
    // make sure no other accepted bids present 
    //  "UPDATE Bids SET status=0 WHERE bid_id<>$1 and service_id=$2;" +
    //  "INSERT INTO Tasks (service_id, caretaker_id) VALUES ($1, $2);" +
    //  "UPDATE Services SET status=2 WHERE service_id=$2;" +
    acceptBidUpdate: "UPDATE Bids SET status=2 WHERE bid_id=$1;",

    // Do inside a transaction 
    // TODO @ JJ
    assignRequestToMe1: "UPDATE Requests SET status=1 where request_id=$1;",
    assignRequestToMe2: "INSERT INTO Handles (manager_id, request_id) VALUES ($1, $2);",

    // Do inside a transaction
    // TODO @ JJ
    requestSolvedUpdate1: "UPDATE Requests SET status=2 where request_id=$1;",
    reqestSolvedUpdate2: "UPDATE Handles SET justification=$1 where request_id=$2;",
}