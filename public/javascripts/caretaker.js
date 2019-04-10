$(document).ready(function () {
  // =================== Tasks =========================== //
  $('.finished-task').click(function () {
    $(this).attr('disabled', 'disabled')
    console.log('Clicking finished task')
    var finishedTaskData = {}
    var row = $(this).parents('tr')
    var rowData = row.find('td:not(:last-child)')
    rowData.each(function () {
      var $th = $(this).closest('table').find('th').eq($(this).index())
      finishedTaskData[$th.text()] = $(this).text()
    })

    $.ajax({
      url: 'caretakerprofile/updateTaskFinished',
      type: 'PUT',
      data: finishedTaskData,
      success: function (res) {
        var result = res.Updated
        if (!result) {
          alert('Task is not updated')
          rejectBidBtn.removeAttr('disabled')
        } else {
          alert('Task is updated')
        }
      }
    })
  })

  // =================== Tasks =========================== //

  // =================== Services =========================== //
  $('[data-toggle="tooltip"]').tooltip()
  var servicesActions = '<a class="add service" title="Add" data-toggle="tooltip"><i class="material-icons">&#xE03B;</i></a>' +
  '<a class="delete service" title="Delete" data-toggle="tooltip"><i class="material-icons">&#xE872;</i></a>'

  $('.add-new-service').click(function () {
    $(this).attr('disabled', 'disabled')
    var index = $('.table.table-services tbody tr:last-child').index()
    var row = '<tr>' +
            '<td></td>' +
            '<td><input type="text" class = "form-control" name="minwage" value = ""></td>' +
            '<td><input type="datetime-local" class = "form-control" name="starting" value = ""></td>' +
            '<td><input type="datetime-local" class = "form-control" name="ending" value = ""></td>' +
      '<td>' + servicesActions + '</td>' +
        '</tr>'
    $('.table.table-services').append(row)
    $('.table.table-services tbody tr').eq(index + 1).find('.add.service').toggle()
  })

  // Add a service and send service data to server
  $(document).on('click', '.add.service', function () {
    var empty = false
    var addServicesData = {}
    var input = $(this).parents('tr').find('input[type="text"] ,input[type="datetime-local"]')
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
          // var dt = new Date(val + "Z")
          // console.log(dt.toDateString())
          // console.log(dt.toISOString())
          // console.log(dt.toLocaleDateString())
          var splitDate = val.split('T')
          var date = splitDate[0]
          var time = splitDate[1] + ':00'
          var parsedDate = date + ' ' + time
          addServicesData[text] = parsedDate
        } else {
          addServicesData[text] = val
        }
      })

      $.ajax({
        url: 'caretakerprofile/addService',
        type: 'POST',
        data: addServicesData,
        success: function (res) {
          var result = res.Updated
          if (!result) {
            alert('Service not added')
          } else {
            alert('Service is added')
            input.each(function () {
              var text = $(this).attr('name')
              var val = $(this).val()
              $(this).parent('td').html(val)
            })
          }
        }
      })
      $(this).parents('tr').find('.add, .delete').toggle()
      $('.add-new-service').removeAttr('disabled')
    }
  })

  // =================== Services =========================== //

  $('.accept-bid').click(function () {
    console.log('Clicing accept bid')
    $(this).attr('disabled', 'disabled')
    var row = $(this).parents('tr')
    var rowData = row.find('td:not(:last-child)')
    var acceptBidData = {}
    rowData.each(function () {
      var $th = $(this).closest('table').find('th').eq($(this).index())
      acceptBidData[$th.text()] = $(this).text()
    })
    var rejectBidBtn = $(this).parents('td').find('.reject-bid')
    rejectBidBtn.attr('disabled', 'disabled')

    $.ajax({
      url: 'caretakerprofile/acceptBid',
      type: 'PUT',
      data: acceptBidData,
      success: function (res) {
        var result = res.Updated
        if (!result) {
          alert('Bid is not accepted')
          rejectBidBtn.removeAttr('disabled')
        } else {
          alert('Accepted bid')
        }
      }
    })
  })

  $('.reject-bid').click(function () {
    console.log('Clicking reject bid')
    $(this).attr('disabled', 'disabled')
    var row = $(this).parents('tr')
    var rowData = row.find('td:not(:last-child)')
    var rejectBidData = {}
    rowData.each(function () {
      var $th = $(this).closest('table').find('th').eq($(this).index())
      rejectBidData[$th.text()] = $(this).text()
    })
    $.ajax({
      url: 'caretakerprofile/rejectBid',
      type: 'PUT',
      data: rejectBidData,
      success: function (res) {
        var result = res.Updated
        if (!result) {
          alert('Bid not rejected')
        } else {
          alert('Rejected bid')
        }
      }
    })
  })

  // Delete row on delete button click
  $(document).on('click', '.delete.service', function () {
    var row = $(this).parents('tr')
    var rowData = row.find('td:not(:last-child)')
    var deletedServiceData = {}
    rowData.each(function () {
      var $th = $(this).closest('table').find('th').eq($(this).index())
      console.log($(this).val())
      deletedServiceData[$th.text()] = $(this).text()
    })
    row.remove()
    console.log(deletedServiceData)
    $.ajax({
      url: 'caretakerprofile/deleteService',
      type: 'DELETE',
      data: deletedServiceData,
      success: function (res) {
        var result = res.Updated
        if (!result) {
          alert('Service not deleted')
        } else {
          alert('Deleted service')
        }
      }
    })

    $('.add-new-service').removeAttr('disabled')
  })

  var xData = []
  for (var i = 0; i < graphData.length; i++) {
    var year = graphData[i].year
    var month = graphData[i].month
    var day = graphData[i].day
    var sum = parseInt(graphData[i].sum)

    var graphPoint = {
      x: new Date(year, month, day),
      y: sum
    }
    xData.push(graphPoint)
  }

  var options = {
    animationEnabled: true,
    theme: 'light2',
    title: {
      text: 'Cumulative Income'
    },
    axisX: {
      valueFormatString: 'DD MM'
    },
    axisY: {
      title: 'Cash',
      minimum: 0,
      prefix: '$'
    },
    toolTip: {
      shared: true
    },
    legend: {
      cursor: 'pointer',
      verticalAlign: 'bottom',
      horizontalAlign: 'left',
      dockInsidePlotArea: true,
      itemclick: toogleDataSeries
    },
    data: [{
      type: 'line',
      showInLegend: true,
      name: 'Cumulative Income',
      markerType: 'square',
      xValueFormatString: 'DD MM, YYYY',
      color: '#F08080',
      yValueFormatString: '#,##0K',
      dataPoints: xData
    }]
  }
  $('#chartContainer').CanvasJSChart(options)

  function toogleDataSeries (e) {
    if (typeof (e.dataSeries.visible) === 'undefined' || e.dataSeries.visible) {
      e.dataSeries.visible = false
    } else {
      e.dataSeries.visible = true
    }
    e.chart.render()
  }
})
