$(document).ready(function () {
  $('[data-toggle="tooltip"]').tooltip()

  $('.assign').click(function () {
    $(this).attr('disabled', 'disabled')
    var assignedRequestData = {}
    $(this).parents('tr').find('td:not(:last-child)').each(function () {
      var $th = $(this).closest('table').find('th').eq($(this).index())
      assignedRequestData[$th.text()] = $(this).text()

      var updateAssignedRequest = $.put('managerprofile/selfAssignRequest', assignedRequestData)
      updateAssignedRequest.done(function (res) {
        console.log(res)
      })
    })
  })
  // Add row on add button click
  $(document).on('click', '.add', function () {
    var empty = false
    var updateRequestData = {}
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
        updateRequestData[text] = val
      })
      var updateRequest = $.put('managerprofile/updateRequest', updateRequestData)
      updateRequest.done(function (res) {
        console.log(res)
      })
      $(this).parents('tr').find('.add, .edit').toggle()
      $('.add-new').removeAttr('disabled')
    }
  })
  // Edit row on edit button click
  $(document).on('click', '.edit', function () {
    $(this).parents('tr').find('td:not(:last-child)').each(function () {
      var $th = $(this).closest('table').find('th').eq($(this).index())
      if ($th.text() == 'Status' || $th.text() == 'Message') {
        $(this).html('<input type="text" class="form-control" name = "' + $th.text() + "value= '" + $(this).text() + '">')
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
})
