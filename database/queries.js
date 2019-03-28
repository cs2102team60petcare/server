// PROSE TO DESCRIBE WORKFLOW: 
// OWNERS want SERVICE from CARETAKERS. OWNERS post SERVICES. 
// CARETAKERS see SERVICES and BIDSFOR them. 
// OWNER can REJECT/ACCEPT Bids. 
// SUCCESSFUL bids become TASKS. 

//status codes: 
//	0 = rejectedOrRetracted(bid)/cancelled(task)/notFoundOrDeleted(services)/unassigned(request) 
//	1 = ongoing(bid)/upcoming(task)/bidding(services)/assigned(request) 
// 	2 = accepted(bid)/finished(task)/successfulBid(services)/solved(request)

// Key: (action)(type)
// Example: (placeBid)(Insert) means you use this to place a bid, and it is of type INSERT.

module.exports = {
	/* ACCESS RELATED QUERIES */
    loginQuery: "SELECT user_id, email, password FROM users WHERE email=$1;",
    deserializeQuery: "SELECT user_id, name  FROM users WHERE user_id=$1;", //used for sessions
    userExistsQuery: "SELECT 1 FROM users WHERE email=$1;",	//make sure to check before signup

    signupUserInsert: "INSERT INTO users (name, email, phone, address, password) VALUES ($1, $2, $3, $4, $5);",
    signupPetInsert: "INSERT INTO pets (owner_id, name, type, biography, born, since) VALUES ($1, $2, $3, $4, $5, $6);",

    /* PROFILE RELATED QUERIES */
    fullUserProfileQuery: "SELECT user_id, name, email, phone, address, created FROM users where user_id=$1;",
    petProfileQuery: "SELECT * from PETS where pet_id=$1;",

    userProfileUpdate: "UPDATE Users SET name=$1, email=$2, phone=$3, address=$4, password=$5 WHERE user_id=$1;",
    caretakerLikesUpdate: "UPDATE Caretakers SET likes=$2 WHERE user_id=$1;",
    petProfileUpdate: "UPDATE Pets SET name=$1, biography=$2, till=$3 WHERE pet_id=$1;",

    //need to expand natural joins out because everything has status
    //WARNING: buggy code ahead @psyf
    /* TASK RELATED QUERIES */
    getMyUpcomingTasksQuery: "SELECT * FROM Tasks T NATURAL JOIN Services S NATURAL JOIN Caretakers C" +
        "WHERE C.caretaker_id=$1 and T.status=1 ORDER BY S.starting desc;",
    getMyTaskHistoryQuery: "SELECT * FROM Tasks T NATURAL JOIN Services S NATURAL JOIN Caretakers C" +
        "WHERE C.caretaker_id=$1 ORDER BY S.starting desc OFFSET $2 LIMIT $3;",

    /* WANTED SERVICES RELATED QUERIES */
    getMyPetsQuery: "SELECT * FROM Pets P NATURAL JOIN Owns O WHERE O.owner_id=$1;",
    wantServiceInsert: "INSERT INTO services (owner_id, pet_id, starting, ending, money) VALUES ($1, $2, $3, $4, $5);",
    removeServiceUpdate:"BEGIN TRANSACTION;" +
    	"UPDATE BidsFor SET status=0 WHERE service_id=$1;" +
    	"UPDATE Services SET status=0 WHERE service_id=$1;" +
    	"COMMIT;",
    serviceHistoryQuery: "SELECT * FROM Services S LEFT OUTER JOIN Tasks T on S.service_id=$1 and (T.service_id=S.service_id)" +
    	"ORDER BY (status, starting) OFFSET $2 LIMIT $3;",

    /* BIDS RELATED QUERIES */
    seeBidsQuery: "SELECT * FROM BidsFor B NATURAL JOIN Services S NATURAL JOIN Caretakers C" +
        "WHERE S.service_id=$1 ORDER BY C.rating desc;",
    placeBidInsert: "INSERT INTO BidsFor (caretaker_id, service_id) VALUES ($1, $2);",
    retractBidUpdate: "BEGIN TRANSACTION;" +
        "UPDATE BidsFor SET status=0 WHERE caretaker_id=$1 and service_id=$2;" +
        "UPDATE BidsFor SET status=1 WHERE caretaker_id<>$1 and service_id=$2;" +
        "UPDATE Services SET status=1 WHERE service_id=$2;" +
        "COMMIT;", //by caretakers themselves  
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