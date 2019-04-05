exports.getCareTakerProfile = function (req, res, next) {
  res.render('caretaker', {
    tasks: [
      {
        task_id: 1,
        petname: 'mrwaffles',
        ownername: 'jj',
        starting: '12/3/19',
        ending: '12/3/22'
      }
    ],
    bids: [
      {
        bids_id: 1,
        pet_id: 2,
        owner_id: 3,
        service_id: 2,
        money: 20,
        status: 'Successful',
        starting: '12/3/18',
        ending: '9/2/20'
      }
    ],
    services: [
      {
        service_id: 1,
        caretaker_id: 2,
        minwage: 20,
        status: 'Taken',
        starting: '18/3/14',
        ending: '16/03/18'
      }
    ],
    tasksHistory: [
      {
        task_id: 1,
        petname: 'mrwaffles',
        ownername: 'jj',
        starting: '12/3/19',
        ending: '12/3/22'
      }
    ]
  })
}
