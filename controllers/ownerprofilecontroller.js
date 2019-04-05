exports.addBid = function (req, res, next) {
  console.log(req.body)
  res.json({ 'Updated': true })
}

exports.updateBid = function (req, res, next) {
  console.log(req.body)
  res.json({ 'Updated': true })
}

exports.deleteBid = function (req, res, next) {
  res.json({ 'Updated': true })
}

exports.addPet = function (req, res, next) {
  console.log(req.body)
  res.json({ 'Updated': true })
}

exports.updatePet = function (req, res, next) {
  console.log(req.body)
  res.json({ 'Updated': true })
}

exports.deletePet = function (req, res, next) {
  console.log(req.body)
  res.json({ 'Updated': true })
}

exports.getOwnerProfile = function (req, res, next) {
  res.render('ownerprofile', {
    bids: [
      { status: 'successful',
        bid_id: '1',
        money: '20',
        ending: '20/4/2019',
        starting: '12/4/2019'
      },
      { status: 'pending',
        bid_id: '2',
        money: '30',
        ending: '20/4/2019',
        starting: '12/4/2019'

      },
      { status: 'cancelled',
        bid_id: '3',
        money: '10',
        ending: '20/4/2019',
        starting: '12/4/2019'

      },
      { status: 'succesful',
        bid_id: '4',
        money: '50',
        ending: '20/4/2019',
        starting: '12/4/2019'
      }
    ],
    pets: [
      {
        pet_id: 1,
        name: 'wuffles',
        type: 'husky',
        biography: 'easy to take care',
        born: '20/9/16',
        death: 'Alive'
      },
      {
        pet_id: 1,
        name: 'wuffles',
        type: 'husky',
        biography: 'easy to take care',
        born: '20/9/16',
        death: 'Alive'
      },
      {
        pet_id: 1,
        name: 'wuffles',
        type: 'husky',
        biography: 'easy to take care',
        born: '20/9/16',
        death: 'Alive'
      },
      {
        pet_id: 1,
        name: 'wuffles',
        type: 'husky',
        biography: 'easy to take care',
        born: '20/9/16',
        death: 'Alive'
      }
    ],
    tasks: [
      {
        task_id: 0,
        user_id: 3,
        name: 'teojunjie',
        starting: '20/1/18',
        ending: '12/5/19',
        money: '20'
      },
      {
        task_id: 0,
        user_id: 3,
        name: 'teojunjie',
        starting: '20/1/18',
        ending: '12/5/19',
        money: '20'
      },
      {
        task_id: 0,
        user_id: 3,
        name: 'teojunjie',
        starting: '20/1/18',
        ending: '12/5/19',
        money: '20'
      },
      {
        task_id: 0,
        user_id: 3,
        name: 'teojunjie',
        starting: '20/1/18',
        ending: '12/5/19',
        money: '20'
      }
    ]

  })
}
