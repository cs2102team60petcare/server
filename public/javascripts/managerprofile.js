$(document).ready(function () {
  $('[data-toggle="tooltip"]').tooltip()

  $('.assign').click(function () {
    $(this).attr('disabled', 'disabled')
    var assignedRequestData = {} 
    $(this).parents('tr').find('td:not(:last-child)').each(function () { //iterates thru except for the last child
      var $th = $(this).closest('table').find('th').eq($(this).index()) //find the closest data 
      assignedRequestData[$th.text()] = $(this).text() //binds the data into the json file 

      $.ajax({
        type: "PUT",
        url: 'managerprofile/selfAssignRequest',
        data: assignedRequestData,
        success: function(res){
          var result = res.Updated
          console.log(res)
          if (!result){
            alert('Req not Assigned')
          }
          else {
            alert('Request Assigned')
          }
        }
      });

    })
  })

  //search for request IDs
  $('.search').change(function () {

    //get the inputs for each box
    var searchRequestIDData = {}  
      searchRequestIDData["search_RID"] = document.getElementById('searchID').value
      searchRequestIDData["offset"] = document.getElementById('offset').value
      searchRequestIDData["show"] = document.getElementById('limit').value

      //updates it
      $.ajax({
        type: "PUT",
        url: 'managerprofile/searchReque,st',
        data: searchRequestIDData,
        success: function(res){
          var result = res.Updated
          console.log(res)
          if (!result){
            alert('Search not made')
          }
          else {
            alert('Search made')
          }
        }
      });

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

