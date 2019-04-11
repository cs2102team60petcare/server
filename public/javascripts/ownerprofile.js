$(document).ready(function () {
  $('.btn-success').trigger('click')
  $('.star').on('click', function () {
    $(this).toggleClass('star-checked')
  })

  $('.ckbox label').on('click', function () {
    $(this).parents('tr').toggleClass('selected')
  })

  $('.btn-filter').on('click', function () {
    var $target = $(this).data('target')
    if ($target != 'all') {
      $('.table.table-bids tr').css('display', 'none')
      $('.table.table-bids tr[data-status="' + $target + '"]').fadeIn('slow')
    } else {
      $('.table.table-bids tr').css('display', 'none').fadeIn('slow')
    }
  })

   // =========================== Services functions =================================== //
  

  // show bids for that service_id
  $(document).on('click', '.view-all-bids', function () {
    var row = $(this).parents('tr')
    var rowData = row.find('td:first') //find the first data only
    var serviceID = {}
    rowData.each(function () {
      var $th = $(this).closest('table').find('th').eq($(this).index())
      console.log($th)
      serviceID[$th.text()] = $(this).text()
      console.log(serviceID)
    })


    $.ajax({
      url: 'ownerprofile/viewBid',
      type: 'GET',
      data: serviceID,
      success: function (res) {
        console.log(res)
        var result = res.Updated
        if (!result) {
          alert('No bids')
        } else {
          alert('All Bids')
        }
      }
    })

  })

  // =========================== Bids functions =================================== //
  var actions = $('.table.table-bids td:last-child').html()
  // Append table with add new bid row form on add new bid button click
  $('.add-new-bid').click(function () {
    $(this).attr('disabled', 'disabled')
    var index = $('.table.table-bids tbody tr:last-child').index()
    // var date = new Date()
    // var numDays = 10
    // var bidExpiryDateandTime = new Date(Date.now() + numDays * 24 * 60 * 60 * 1000)
    var row = '<tr>' +
            '<td>' + '</td>' +
            '<td><input type="text" class="form-control" name="pet_id" id="status"></td>' +
            '<td><input type="text" class="form-control" name="service_id" id="status"></td>' +
            '<td><input type="text" class="form-control" name="money" id="status"></td>' +
            '<td>' + '</td>' +
            '<td><input type="datetime-local" class = "form-control" name="starting" value = ""></td>' +
            '<td><input type="datetime-local" class = "form-control" name="ending" value = ""></td>' +
            '<td>' + actions + '</td>' +
            '</tr>'
    $('.table.table-bids').append(row)
    $('.table.table-bids tbody tr').eq(index + 1).find('.add').toggle()
  })

  // Send input row data on add button click
  $(document).on('click', '.add.bid', function () {
    var empty = false
    var input = $(this).parents('tr').find('input[type="text"], input[type="datetime-local"]')
    var addBidData = {}
    input.each(function () {
      if (!$(this).val()) {
        $(this).addClass('error')
        empty = true
      } else {
        $(this).removeClass('error')
      }
    })
    $(this).parents('tr').find('.error').first().focus()
    if (!empty) {
      input.each(function () {
        var text = $(this).attr('name')
        var val = $(this).val()
        if ($(this).attr('type') == 'datetime-local') {
          var splitDate = val.split('T')
          var date = splitDate[0]
          var time = splitDate[1] + ':00'
          var parsedDate = date + ' ' + time
          addBidData[text] = parsedDate
        } else {
          addBidData[text] = val
        }
      })

      addBidData['status'] = 1 // 0 = rejected , 1 = Pending, 2= Success

      $.ajax({
        url: 'ownerprofile/addBid',
        type: 'POST',
        data: addBidData,
        success: function (res) {
          var result = res.Updated
          if (!result) {
            alert('Bid is not added')
          } else {
            alert('Bid is added')
            input.each(function () {
              var text = $(this).attr('name')
              var val = $(this).val()
              $(this).parent('td').html(val)
            })
          }
        }
      })

      $(this).parents('tr').find('.update, .edit').toggle()
      $('.add-new-bid').removeAttr('disabled')
    }
  })

  // Delete row on delete button click
  $(document).on('click', '.delete', function () {
    var row = $(this).parents('tr')
    var rowData = row.find('td:not(:last-child)')
    var deletedBidData = {}
    rowData.each(function () {
      var $th = $(this).closest('table').find('th').eq($(this).index())
      deletedBidData[$th.text()] = $(this).text()
    })

    $('.add-new-bid').removeAttr('disabled')

    $.ajax({
      url: 'ownerprofile/deleteBid',
      type: 'DELETE',
      data: deletedBidData,
      success: function (res) {
        var result = res.Updated
        if (!result) {
          alert('Bid not deleted')
        } else {
          alert('Bid is deleted')
          row.remove()
        }
      }
    })

    $('.add-new-bid').removeAttr('disabled')
  })

  // =========================== Bids functions =================================== //

  // =========================== Pets functions =================================== //

  // Append table with add new pet row form on add new pet button click
  var petActions = '<a class="add pet" title="Add" data-toggle="tooltip"><i class="material-icons">&#xE03B;</i></a>' +
        '<a class="edit pet" title="Edit" data-toggle="tooltip"><i class="material-icons">&#xE254;</i></a>' +
        '<a class="update pet" title="Update" data-toggle="tooltip"><i class="material-icons">add</i></a>' +
        '<a class="delete pet" title="Delete" data-toggle="tooltip"><i class="material-icons">&#xE872;</i></a>'

  $('.add-new-pet').click(function () {
    console.log('clicking add new pet')
    $(this).attr('disabled', 'disabled')
    var index = $('.table.table-pets tbody tr:last-child').index()
    var row = '<tr>' +
            '<td>' + '</td>' +
            '<td><input type="text" class = "form-control" name="pet_name" value = ""></td>' +
            '<td><input type="text" class = "form-control" name="pet_information" value = ""></td>' +
            '<td><input type="text" class = "form-control" name="pet_type" value = ""></td>' +
            '<td><input type="datetime-local" class = "form-control" name="pet_born" value = ""></td>' +
           '<td>' + petActions + '</td>' +
            '</tr>'
    $('.table.table-pets').append(row)
    $('.table.table-pets tbody tr').eq(index + 1).find('.update, .edit').toggle()
  })

  // Add input row on add button click
  $(document).on('click', '.update.pet', function () {
    var empty = false
    var input = $(this).parents('tr').find('input[type="text"], input[type="datetime-local"]')
    var addPetData = {}
    input.each(function () {
      if (!$(this).val()) {
        $(this).addClass('error')
        empty = true
      } else {
        $(this).removeClass('error')
      }
    })
    $(this).parents('tr').find('.error').first().focus()
    if (!empty) {
      input.each(function () {
        var text = $(this).attr('name')
        var val = $(this).val()
        if ($(this).attr('type') == 'datetime-local') {
          var splitDate = val.split('T')
          var date = splitDate[0]
          var time = splitDate[1] + ':00'
          var parsedDate = date + ' ' + time
          addPetData[text] = parsedDate
        } else {
          addPetData[text] = val
        }
      })

      $.ajax({
        url: 'ownerprofile/addPet',
        type: 'POST',
        data: addPetData,
        success: function (res) {
          var result = res.Updated
          if (!result) {
            alert('Pet not added')
          } else {
            alert('Pet is added')
            input.each(function () {
              var text = $(this).attr('name')
              var val = $(this).val()
              $(this).parent('td').html(val)
            })
          }
        }
      })

      $(this).parents('tr').find('.update, .edit').toggle()
      $('.add-new-pet').removeAttr('disabled')
    }
  })
  // Edit row on edit button click
  $(document).on('click', '.edit.pet', function () {
    console.log('Editing pet')
    $(this).parents('tr').find('td:not(:last-child)').each(function () {
      var $th = $(this).closest('table').find('th').eq($(this).index())
      console.log($th.text())
      if ($th.text() == 'Bio' || $th.text() == 'Name') {
        $(this).html('<input type="text" class="form-control" name = "' + $th.text() + '"' + 'value = "' + $(this).text() + '">')
      }
    })
    $(this).parents('tr').find('.add, .edit').toggle()
    $('.add-new-pet').attr('disabled', 'disabled')
  })

  // Update edited row on update button click
  $(document).on('click', '.add.pet', function () {
    console.log('Clicking update pet')
    var empty = false
    var input = $(this).parents('tr').find('input[type="text"]')
    var addUpdatedPetData = {}
    input.each(function () {
      if (!$(this).val()) {
        $(this).addClass('error')
        empty = true
      } else {
        $(this).removeClass('error')
      }
    })
    $(this).parents('tr').find('.error').first().focus()
    if (!empty) {
      input.each(function () {
        var text = $(this).attr('name')
        var val = $(this).val()
        $(this).parent('td').html(val)
        addUpdatedPetData[text] = val
      })

      $.ajax({
        url: 'ownerprofile/updatePet',
        type: 'PUT',
        data: addUpdatedPetData,
        success: function (res) {
          var result = res.Updated
          if (!result) {
            alert('Pet is not updated')
          } else {
            alert('Pet is updated')
            input.each(function () {
              var text = $(this).attr('name')
              var val = $(this).val()
              $(this).parent('td').html(val)
            })
          }
        }
      })

      $(this).parents('tr').find('.update, .edit').toggle()
      $('.add-new-bid').removeAttr('disabled')
    }
  })
  // =========================== Pets functions =================================== //
  /**
  var xData = {
      1 : [
        {
            type: 'line',
            showInLegend: true,
            name: 'Demand by Hour',
            markerType: 'square',
            color: '#F08080',
            dataPoints: [
                {
                    x: hour,
                    y: ration
                },
                {
                    x: hour,
                    y: ration
                },

            ]
          }
      ]
  }
  */
  var xData = {}
  for (var i = 0; i < graphData.length; i++) {
    var day = graphData[i].day
    var hour = graphData[i].hour
    var ratio = graphData[i].ratio

    var graphPoint = {
      x: hour,
      y: ratio
    }

    if (xData[day]) {
      xData[day].push(graphPoint)
    } else {
      xData[day] = [graphPoint]
    }
  }

  var multipleData = []
  var colors = ['#Ffd700', '#Ffa500', '#40e0d0', '#00ff7f', '#FFC0CB', '#00ff00', '#C6e2ff']
  for (var dataKey in xData) {
    if (xData.hasOwnProperty(dataKey)) {
      var dataValue = xData[dataKey]

      var dataColumn = {
        type: 'line',
        showInLegend: true,
        name: 'Demand by Hour',
        markerType: 'square',
        color: colors[parseInt(dataKey) - 1],
        dataPoints: dataValue
      }
      multipleData.push(dataColumn)
    }
  }
  console.log(xData)

  var options = {
    animationEnabled: true,
    theme: 'light2',
    title: {
      text: 'Demand'
    },
    axisX: {
      title: 'Time'
    },
    axisY: {
      title: 'Ratio',
      minimum: 0,
      maximum: 1
    },
    toolTip: {
      shared: true
    },
    legend: {
      cursor: 'pointer',
      verticalAlign: 'bottom',
      horizontalAlign: 'left',
      dockInsidePlotArea: true,
      itemclick: toggleDataSeries
    },
    data: multipleData
  }
  $('#chartContainer').CanvasJSChart(options)

  function toggleDataSeries (e) {
    if (typeof (e.dataSeries.visible) === 'undefined' || e.dataSeries.visible) {
      e.dataSeries.visible = false
    } else {
      e.dataSeries.visible = true
    }
    e.chart.render()
  }
})
