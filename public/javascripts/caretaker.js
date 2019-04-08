$(document).ready(function () {
  // =================== Services =========================== //
  $('[data-toggle="tooltip"]').tooltip()
  var servicesActions = '<a class="add service" title="Add" data-toggle="tooltip"><i class="material-icons">&#xE03B;</i></a>' +
  '<a class="edit service" title="Edit" data-toggle="tooltip"><i class="material-icons">&#xE254;</i></a>' +
  '<a class="update service" title="Update" data-toggle="tooltip"><i class="material-icons">add</i></a>' +
  '<a class="delete service" title="Delete" data-toggle="tooltip"><i class="material-icons">&#xE872;</i></a>'

  $('.add-new-service').click(function () {
    $(this).attr('disabled', 'disabled')
    var index = $('.table.table-services tbody tr:last-child').index()
    var row = '<tr>' +
            '<td></td>' + '<td></td>' +
            '<td><input type="text" class = "form-control" name="minwage" value = ""></td>' +
            '<td></td>' +
            '<td><input type="text" class = "form-control" name="starting" value = ""></td>' +
            '<td><input type="text" class = "form-control" name="ending" value = ""></td>' +
      '<td>' + servicesActions + '</td>' +
        '</tr>'
    $('.table.table-services').append(row)
    $('.table.table-services tbody tr').eq(index + 1).find('.edit .add').toggle()
  })

  // Add a service and send service data to server
  $(document).on('click', '.add.service', function () {
    var empty = false
    var addServicesData = {}
    var input = $(this).parents('tr').find('input[type="text"]')
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
        addServicesData[text] = val
      })

      $.ajax({
        url: 'caretakerprofile/addService',
        type: 'POST',
        data: addServicesData,
        success: function (res) {
          var result = res.updated
          if (!result) {
            alert ('Service not added')
          } else {
            alert ('Service is added')
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
      acceptBidData[$th.text()] = $(this).val()
    })

    $.ajax({
      url: 'caretakerprofile/acceptBid',
      type: 'PUT',
      data: acceptBidData,
      success: function (res) {
        var result = res.updated
        if (!result) {
          alert ('Bid is not accepted')
        } else {
          alert ('Accepted bid')
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
      rejectBidData[$th.text()] = $(this).val()
    })
    $.ajax({
      url: 'caretakerprofile/rejectBid',
      type: 'PUT',
      data: rejectBidData,
      success: function (res) {
        var result = res.updated
        if (!result) {
          alert ('Bid not rejected')
        } else {
          alert ('Rejected bid')
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
      deletedServiceData[$th.text()] = $(this).val()
    })
    row.remove()

    var deleteRequest = $.delete('caretakerprofile/deleteService', deletedServiceData)
    deleteRequest.done(function (res) {
      console.log(res)
    })

    $.ajax({
      url: 'caretakerprofile/deleteService',
      type: 'DELETE',
      data: deletedServiceData,
      success: function (res) {
        var result = res.updated
        if (!result) {
          alert ('Service not deleted')
        } else {
          alert ('Service deleted')
        }
      }
    })

    $('.add-new-service').removeAttr('disabled')
  })
})
