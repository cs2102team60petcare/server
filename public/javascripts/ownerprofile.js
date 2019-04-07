$(document).ready(function () {
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

  // =========================== Bids functions =================================== //
  var actions = $('.table.table-bids td:last-child').html()
  // Append table with add new bid row form on add new bid button click
  $('.add-new-bid').click(function () {
    $(this).attr('disabled', 'disabled')
    var index = $('.table.table-bids tbody tr:last-child').index()
    var rowCount = $('.table.table-bids tr').length
    var date = new Date()
    var numDays = 10
    var bidExpiryDateandTime = new Date(Date.now() + numDays * 24 * 60 * 60 * 1000)
    var row = '<tr>' +
            '<td>' + rowCount + '</td>' +
            '<td><input type="text" class="form-control" name="pet_id" id="status"></td>' +
            '<td><input type="text" class="form-control" name="service_id" id="status"></td>' +
            '<td><input type="text" class="form-control" name="money" id="status"></td>' +
            '<td>Pending</td>' +
            '<td>' + date.toLocaleDateString() + '</td>' +
            '<td>' + bidExpiryDateandTime.toLocaleDateString() + '</td>' +
			'<td>' + actions + '</td>' +
        '</tr>'
    	$('.table.table-bids').append(row)
    $('.table.table-bids tbody tr').eq(index + 1).find('.update, .edit').toggle()
  })

  	// Send input row data on add button click
  $(document).on('click', '.add.bid', function () {
    var empty = false
    var date = new Date()
    var bidExpiryDateandTime = new Date(Date.now() + numDays * 24 * 60 * 60 * 1000)
    var input = $(this).parents('tr').find('input[type="text"]')
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
        $(this).parent('td').html(val)
        addBidData['"' + text + '"'] = val
      })
      addBidData['starting'] = date.toLocaleDateString()
      addBidData['ending'] = bidExpiryDateandTime.toLocaleDateString()
      addBidData['status'] = 1 // 0 = rejected , 1 = Pending, 2= Success
      var postRequest = $.post('ownerprofile/addBid', addBidData)
      postRequest.done(function (res) {
        console.log(res)
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
      deletedBidData[$th.text()] = $(this).val()
    })
    row.remove()
    $('.add-new-bid').removeAttr('disabled')
    var deleteRequest = $.delete('ownerprofile/deleteBid', deletedBidData)
    deleteRequest.done(function (res) {
      console.log(res)
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
    var rowCount = $('.table.table-pets tr').length
    var row = '<tr>' +
            '<td>' + rowCount + '</td>' +
            '<td><input type="text" class = "form-control" name="pet_name" value = ""></td>' +
            '<td><input type="text" class = "form-control" name="pet_information" value = ""></td>' +
            '<td><input type="text" class = "form-control" name="pet_type" value = ""></td>' +
            '<td><input type="text" class = "form-control" name="pet_born" value = ""></td>' +
            '<td><input type="text" class = "form-control" name="pet_death" value = ""></td>' +
      '<td>' + petActions + '</td>' +
        '</tr>'
    $('.table.table-pets').append(row)
    $('.table.table-pets tbody tr').eq(index + 1).find('.update, .edit').toggle()
  })

  // Add input row on add button click
  $(document).on('click', '.update.pet', function () {
    var empty = false
    var input = $(this).parents('tr').find('input[type="text"]')
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
        $(this).parent('td').html(val)
        addPetData[text] = val
      })
      var postRequest = $.post('ownerprofile/addPet', addPetData)
      postRequest.done(function (res) {
        console.log(res)
      })

      $(this).parents('tr').find('.update, .edit').toggle()
      $('.add-new-pet').removeAttr('disabled')
    }
  })
  // Edit row on edit button click
  $(document).on('click', '.edit.pet', function () {
    $(this).parents('tr').find('td:not(:last-child)').each(function () {
      var $th = $(this).closest('table').find('th').eq($(this).index())
      if ($th.text() != 'Pet id') {
        $(this).html('<input type="text" class="form-control" name = "' + $th.text() + "value= '" + $(this).text() + '">')
      }
    })
    $(this).parents('tr').find('.add, .edit').toggle()
    $('.add-new-pet').attr('disabled', 'disabled')
  })

  // Update edited row on update button click
  $(document).on('click', '.update.pet', function () {
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

      var updateRequest = $.put('ownerprofile/updatePet', addUpdatedPetData)
      updateRequest.done(function (res) {
        console.log(res)
      })

      $(this).parents('tr').find('.update, .edit').toggle()
      $('.add-new-bid').removeAttr('disabled')
    }
  })

  // Delete row on delete button click
  $(document).on('click', '.delete.pet', function () {
    var row = $(this).parents('tr')
    var rowData = row.find('td:not(:last-child)')
    var deletedPetData = {}
    rowData.each(function () {
      var $th = $(this).closest('table').find('th').eq($(this).index())
      deletedPetData[$th.text()] = $(this).val()
    })
    row.remove()
    $('.add-new-pet').removeAttr('disabled')
    var deleteRequest = $.delete('ownerprofile/deletePet', deletedPetData)
    deleteRequest.done(function (res) {
      console.log(res)
    })
  })
// =========================== Pets functions =================================== //
})
