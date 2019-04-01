module.exports = {
    /* ACCESS RELATED QUERIES */
    loginQuery: "SELECT user_id, name , email, password FROM users WHERE email=$1;", //used for login
    deserializeQuery: "SELECT user_id, name  FROM users WHERE user_id=$1;", //used for sessions

    userExistsQuery: "SELECT user_id FROM users WHERE email=$1;", //todo: @ jj used as check before signup 

    //TODO: @Psyf no deletion yet. 
    //WARNING: Use signUpUserInsert in a Transaction with one of the next two 
    signupUserInsert: "INSERT INTO users (name, email, phone, address, password) VALUES ($1, $2, $3, $4, $5) RETURNING *",
    signupOwnerInsert: "INSERT INTO owners (user_id) VALUES ($1);",
    signupCareTakerInsert: "INSERT INTO caretakers (user_id, likes) VALUES ($1, $2);",

    // WARNING: Use signupPetInsert with the next query in a transaction
    signupPetInsert: "INSERT INTO pets (name, type, biography, born) VALUES ($1, $2, $3, $4);",
    ownsPetInsert: "INSERT INTO owns (pet_id, owner_id, since) VALUES ($1, $2, $3);",

    /* PROFILE RELATED QUERIES */
    fullUserProfileQuery: "SELECT user_id, name, email, phone, address, created FROM users where user_id=$1;",
    petProfileQuery: "SELECT * from PETS where pet_id=$1;",

    userProfileUpdate: "UPDATE Users SET name=$1, email=$2, phone=$3, address=$4 WHERE user_id=$1;",
    //WARNING: Make sure Password is hashed with bcrypt when updating
    userPasswordUpdate: "UPDATE Users SET password=$1 WHERE user_id=$2;",

    caretakerLikesUpdate: "UPDATE Caretakers SET likes=$1 WHERE user_id=$2;",
    petProfileUpdate: "UPDATE Pets SET name=$1, biography=$2 WHERE pet_id=$3;",

    getMyUpcomingTasksQuery: "SELECT * FROM Tasks T NATURAL JOIN Services S NATURAL JOIN Caretakers C" +
        "WHERE C.user_id=$1 and T.status=1 ORDER BY S.starting desc;",
    getMyTaskHistoryQuery: "SELECT * FROM Tasks T NATURAL JOIN Services S NATURAL JOIN Caretakers C" +
        "WHERE C.user_id=$1 ORDER BY S.starting desc OFFSET $2 LIMIT $3;",

    getMyPetsQuery: "SELECT * FROM Pets P NATURAL JOIN Owns O WHERE O.owner_id=$1;",

    // Use when Caretaker is offering new service
    // minWage is per hour. This is because people can bid for a chunk of his time. 
    // Note: One task per service, even if the caretaker has free time. 
    offerServiceInsert: "INSERT INTO services (caretaker_id, starting, ending, minWage) VALUES ($1, $2, $3, $4);",

    serviceHistoryQuery: "SELECT S.service_id, T.task_id, S.status, S.starting, S.ending, T.status, S.minWage, B.money, B.owner_id, B.pet_id" +
        "FROM Services S LEFT OUTER JOIN (Bids B join Tasks T on B.bid_id=T.bid_id) on S.service_id=$1 and (B.service_id=S.service_id)" +
        "ORDER BY (starting) OFFSET $2 LIMIT $3;",

    /* BIDS RELATED QUERIES */
    seeBidsQuery: "SELECT * FROM Bids B NATURAL JOIN Services S" +
        "WHERE S.service_id=$1 ORDER BY B.money desc;",

    //TODO: @Psyf Need trigger to ensure starting, ending, TYPE compatibility and money is valid too 
    placeBidInsert: "INSERT INTO Bids (starting, ending, money, owner_id, pet_id, service_id) VALUES ($1, $2, $3, $4, $5, $6);",


    //----------------------- TESTED UNTIL HERE --------------------------------//

    // Use when Caretaker is removing a service
    // Note: No edits. You can remove and add again if needed. 
    removeServiceUpdate: "BEGIN TRANSACTION;" +
        "UPDATE BidsFor SET status=0 WHERE service_id=$1;" +
        "UPDATE Services SET status=0 WHERE service_id=$1;" +
        "COMMIT;",

    // Again, you can only remove and add bids, no edits. 
    retractBidUpdate: "BEGIN TRANSACTION;" +
        "UPDATE BidsFor SET status=0 WHERE caretaker_id=$1 and service_id=$2;" +
        "UPDATE BidsFor SET status=1 WHERE caretaker_id<>$1 and service_id=$2;" +
        "UPDATE Services SET status=1 WHERE service_id=$2;" +
        "COMMIT;", //by owners themselves  

    acceptBidUpdate: "BEGIN TRANSACTION;" +
        "UPDATE BidsFor SET status=2 WHERE caretaker_id=$1 and service_id=$2;" +
        "UPDATE BidsFor SET status=0 WHERE caretaker_id<>$1 and service_id=$2;" +
        "INSERT INTO Tasks (service_id, caretaker_id) VALUES ($1, $2);" +
        "UPDATE Services SET status=2 WHERE service_id=$2;" +
        "COMMIT;",
    rejectBidUpdate: "UPDATE BidsFor SET status=0 WHERE caretaker_id=$1 and service_id=$2;",

    /* REVIEW RELATED QUERIES */
    sendReviewInsert: "BEGIN TRANSACTION;" +
        "INSERT INTO Reviews (stars, note, task_id, caretaker_id, owner_id) VALUES ($1, $2, $3, $4, $5);" +
        "UPDATE Caretakers SET ratings=($1/((SELECT count(*) FROM Reviews WHERE caretaker_id=$4))*5);" +
        "COMMIT;",

    /* REQUEST or SUPPORTTICKET RELATED QUERIES */
    sendRequestInsert: "INSERT INTO Requests (message, user, user_id) VALUES ($1, $2, $3);",
    getUnassignedRequests: "SELECT * FROM Requests WHERE status=0;",
    getRequestsAssignedToMe: "SELECT * From Requests NATURAL JOIN Handles WHERE manager_id=$1 ORDER by status OFFSET $2 LIMIT $3;"
}