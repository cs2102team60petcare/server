exports.getManagerProfile = function (req, res, next) {
  res.render('managerprofile', {
    requests: [
      {
        request_id: 1,
        user_id: 2,
        status: 'solved',
        created: '11/2/19',
        message: 'Please attend urgently'
      },
      {
        request_id: 2,
        user_id: 2,
        status: 'solved',
        created: '11/2/19',
        message: 'Please attend urgently'
      },
      {
        request_id: 3,
        user_id: 2,
        status: 'solved',
        created: '11/2/19',
        message: 'Please attend urgently'
      },
      {
        request_id: 4,
        user_id: 2,
        status: 'solved',
        created: '11/2/19',
        message: 'Please attend urgently'
      }

    ]
  })
}
