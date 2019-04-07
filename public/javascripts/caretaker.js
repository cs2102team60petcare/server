$(document).ready(function () {
  $('[data-toggle="tooltip"]').tooltip()
  var servicesActions = '<a class="add service" title="Add" data-toggle="tooltip"><i class="material-icons">&#xE03B;</i></a>' +
  '<a class="delete service" title="Delete" data-toggle="tooltip"><i class="material-icons">&#xE872;</i></a>'

  $('.add-new-service').click(function () {
    $(this).attr('disabled', 'disabled')
    var index = $('.table.table-services tbody tr:last-child').index()
    var row = '<tr>' +
            '<td></td>' + '<td></td>' +
            '<td><input type="text" class = "form-control" name="minwage" value = ""></td>' +
            '<td><input type="text" class = "form-control" name="status" value = ""></td>' +
            '<td><input type="text" class = "form-control" name="starting" value = ""></td>' +
            '<td><input type="text" class = "form-control" name="ending" value = ""></td>' +
      '<td>' + servicesActions + '</td>' +
        '</tr>'
    $('.table.table-services').append(row)
    $('.table.table-services tbody tr').eq(index + 1).find('.add .delete').toggle()
  })

  $('.accept-bid').click(function () {
    $(this).attr('disabled', 'disabled')
    var row = $(this).parents('tr')
    var rowData = row.find('td:not(:last-child)')
    var acceptBidData = {}
    rowData.each(function () {
      var $th = $(this).closest('table').find('th').eq($(this).index())
      acceptBidData[$th.text()] = $(this).val()
    })

    var acceptBidRequest = $.put('caretakerprofile/acceptBid', acceptBidData)
    acceptBidRequest.done(function (res) {
      console.log(res)
    })
  })
  // Add row on add button click
  $(document).on('click', '.add', function () {
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
        $(this).parent('td').html(val)
        addServicesData[text] = val
      })
      var addServiceRequest = $.post('caretakerprofile/addService', addServicesData)
      addServiceRequest.done(function (res) {
        console.log(res)
      })
      $(this).parents('tr').find('.add, .delete').toggle()
      $('.add-new-service').removeAttr('disabled')
    }
  })

  // Delete row on delete button click
  $(document).on('click', '.delete', function () {
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

    $('.add-new-service').removeAttr('disabled')
  })
})
