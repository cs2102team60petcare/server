$(document).ready(function () {
  $('[data-toggle="tooltip"]').tooltip()

  $('.assign').click(function () {
    $(this).attr('disabled', 'disabled')
    var assignedRequestData = {}
    $(this).parents('tr').find('td:not(:last-child)').each(function () { // iterates thru except for the last child
      var $th = $(this).closest('table').find('th').eq($(this).index()) // find the closest data
      assignedRequestData[$th.text()] = $(this).text() // binds the data into the json file
    })
    $.ajax({
      type: 'PUT',
      url: 'managerprofile/selfAssignRequest',
      data: assignedRequestData,
      success: function (res) {
        var result = res.Updated
        console.log(res)
        if (!result) {
          alert('Req not Assigned')
        } else {
          alert('Request Assigned')
        }
      }
    })
  })

  // search for request IDs
  $('.search').change(function () {
    // get the inputs for each box
    var searchRequestIDData = {}
    searchRequestIDData['search_RID'] = parseInt(document.getElementById('searchID').value)
    searchRequestIDData['offset'] = parseInt(document.getElementById('offset').value)
    searchRequestIDData['show'] = parseInt(document.getElementById('limit').value)

    // updates it
    $.ajax({
      type: 'PUT',
      url: 'managerprofile/searchRequest',
      data: searchRequestIDData,
      success: function (res) {
        var result = res.Updated
        var data = res.UpdatedData
        console.log(data)
        if (!result) {
          alert('Search not made')
        } else {
          var table = $('#table-requests')
          var oldTableRows = $('#table-requests > tbody > tr')
          oldTableRows.remove()
          for (var i = 0; i < data.length; i++) {
            var requestID = data[i]['request_id']
            var message = data[i]['message']
            var status = data[i]['status']
            var created = data[i]['created']
            var userID = data[i]['user_id']
            var td = '<tr>' +
                     '<td>' + requestID + '</td>' +
                     '<td>' + userID + '</td>' +
                     '<td>' + status + '</td>' +
                     '<td>' + created + '</td>' +
                     '<td>' + message + '</td>' +
                     '<td>' +
                        '<a class="add" title="Add" data-toggle="tooltip"><i class="material-icons">&#xE03B;</i></a>' +
                        '<a class="edit" title="Edit" data-toggle="tooltip"><i class="material-icons">&#xE254;</i></a>' +
                     '</td>' +
                     '</tr>'
            table.append(td)
          }
          alert('Search made')
        }
      }
    })
  })

  // Add justification on add button click
  $(document).on('click', '.add', function () {
    var empty = false
    var updateRequestData = {}
    var input = $(this).parents('tr').find('input[type="text"]')
    var requestTableData = $(this).parents('tr').find('td:not(:last-child)')

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
        $(this).parents('td').html(val)
        updateRequestData[text] = val
      })

      requestTableData.each(function () {
        var $th = $(this).closest('table').find('th').eq($(this).index())
        if ($th.text() != 'Justification') {
          updateRequestData[$th.text()] = $(this).text()
        }
      })

      $.ajax({
        type: 'PUT',
        url: 'managerprofile/updateRequest',
        data: updateRequestData,
        success: function (res) {
          var result = res.Updated
          console.log(res)
          if (!result) {
            alert('Request not resolved')
          } else {
            alert('Request resolved with justification')
          }
        }
      })

      $(this).parents('tr').find('.add, .edit').toggle()
      $('.add-new').removeAttr('disabled')
    }
  })

  // Justify on edit button click
  $(document).on('click', '.edit', function () {
    $(this).parents('tr').find('td:not(:last-child)').each(function () { // iterates thru except for the last child
      var $th = $(this).closest('table').find('th').eq($(this).index()) // find the closest data
      if ($th.text() == 'Justification') { // add value to the header
        $(this).html('<input type="text" class="form-control" name = "' + $th.text() + '">')
      }
    })
    $(this).parents('tr').find('.add, .edit').toggle()
    $('.add-new').attr('disabled', 'disabled')
  })

  // Delete row on delete button click
  $(document).on('click', '.delete', function () {
    $(this).parents('tr').remove()
    $('.add-new').removeAttr('disabled')
  })

  $('#SendQueryBtn').click(function () {
    $(this).attr('disabled', 'disabled')
    var sendQueryText = $(this).parents('.container').find('input[type="text"]').val()
    var sendQueryData = {}
    var queryResultTextBox = $('#results-query')
    queryResultTextBox.innerHtml = 'Hello world'
    console.log(queryResultTextBox)
    sendQueryData['Query'] = sendQueryText
    $.ajax({
      type: 'POST',
      url: 'managerprofile/sendQuery',
      data: sendQueryData,
      success: function (res) {
        var result = res.Updated
        var updatedData = res.UpdatedData
        console.log(res)
        if (!result) {
          alert('Query not send')
        } else {
          alert('Query send with result')
          queryResultTextBox.val(JSON.stringify(updatedData))
        }
      }
    })
  })

  var xData = {}
  for (var i = 0; i < graphData.length; i++) {
    var careTakerID = graphData[i].caretaker_id
    var month = graphData[i].month
    var money = graphData[i].money

    var graphPoint = {
      label: month,
      y: money
    }

    if (xData[careTakerID]) {
      xData[careTakerID].push(graphPoint)
    } else {
      xData[careTakerID] = [graphPoint]
    }
  }

  var multipleData = []
  for (var dataKey in xData) {
    if (xData.hasOwnProperty(dataKey)) {
      var dataValue = xData[dataKey]

      var dataColumn = {
        type: 'column',
        dataPoints: dataValue
      }
      multipleData.push(dataColumn)
    }
  }

  var options = {
    title: {
      text: 'Average earnings per hour'
    },
    data: multipleData
  }
  $('#chartContainer').CanvasJSChart(options)
})
