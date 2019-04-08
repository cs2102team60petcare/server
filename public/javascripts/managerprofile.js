$(document).ready(function () {
  $('[data-toggle="tooltip"]').tooltip()

  $('.assign').click(function () {
    $(this).attr('disabled', 'disabled')
    var assignedRequestData = {} 
    $(this).parents('tr').find('td:not(:last-child)').each(function () { //iterates thru except for the last child
      var $th = $(this).closest('table').find('th').eq($(this).index()) //find the closest data 
      assignedRequestData[$th.text()] = $(this).text() //binds the data into the json file 

      var updateAssignedRequest = $.put('managerprofile/selfAssignRequest', assignedRequestData)
      updateAssignedRequest.done(function (res) {
        console.log(res)
      })
    })
  })

  //search for request IDs
  $('.search').change(function () {
    //$(this).attr('disabled', 'disabled')
    var searchRequestIDData = {}  
      searchRequestIDData = $(this).text() //binds the data into the json file 

      var searchRequest = $.put('managerprofile/searchRequest', searchRequestIDData)
      searchRequest.done(function (res) {
        console.log(res)
      })
    })
  })

  // Add justification on add button click 
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

  // Justify on edit button click
  $(document).on('click', '.edit', function () {
    $(this).parents('tr').find('td:not(:last-child)').each(function () { //iterates thru except for the last child
      var $th = $(this).closest('table').find('th').eq($(this).index()) //find the closest data
      if ($th.text() == 'Message') { //add value to the header 
        $(this).html('<input type="text" class="form-control" name = "' + $th.text() + "value= '" + $(this).text() + '">')
      }  
    })
    $(this).parents('tr').find('.add, .edit').toggle()
    $('.add-new').attr('disabled', 'disabled')
  })

  //Delete row on delete button click
  $(document).on('click', '.delete', function () {
    $(this).parents('tr').remove()
    $('.add-new').removeAttr('disabled')
  })


})
