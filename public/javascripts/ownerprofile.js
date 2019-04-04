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
            '<td><input type="text" class="form-control" name="service_id" id="status"></td>' +
            '<td>Pending</td>' +
            '<td>' + date.toLocaleDateString() + '</td>' +
            '<td>' + bidExpiryDateandTime.toLocaleDateString() + '</td>' +
			'<td>' + actions + '</td>' +
        '</tr>'
    	$('.table.table-bids').append(row)
    $('.table.table-bids tbody tr').eq(index + 1).find('.add, .edit').toggle()
  })

  	// Add row on add button click
  $(document).on('click', '.add', function () {
    var empty = false
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
        $(this).parent('td').html($(this).val())
      })
      $(this).parents('tr').find('.add, .edit').toggle()
      $('.add-new-bid').removeAttr('disabled')
    }
  })

  // Edit row on edit button click
  $(document).on('click', '.edit', function () {
    $(this).parents('tr').find('td:not(:last-child)').each(function () {
      var $th = $(this).closest('table').find('th').eq($(this).index())
      if ($th.text() == 'Bid Price') {
        $(this).html('<input type="text" class="form-control" value="' + $(this).text() + '">')
      }
    })
    $(this).parents('tr').find('.add, .edit').toggle()
    $('.add-new-bid').attr('disabled', 'disabled')
  })
  // Delete row on delete button click
  $(document).on('click', '.delete', function () {
    $(this).parents('tr').remove()
    $('.add-new-bid').removeAttr('disabled')
  })

  // =========================== Bids functions =================================== //

  // =========================== Pets functions =================================== //

  // Append table with add new bid row form on add new bid button click
  var petActions = $('.table.table-pets td:last-child').html()
  $('.add-new-pet').click(function () {
    console.log('clicking add new pet')
    $(this).attr('disabled', 'disabled')
    var index = $('.table.table-pets tbody tr:last-child').index()
    var rowCount = $('.table.table-pets tr').length
    var row = '<tr>' +
            '<td>' + rowCount + '</td>' +
            '<td><input type="text" class="form-control" name="pet_name"></td>' +
            '<td><input type="text" class="form-control" name="pet_information"></td>' +
            '<td><input type="text" class="form-control" name="pet_type"></td>' +
            '<td><input type="text" class="form-control" name="pet_born"></td>' +
      '<td>' + petActions + '</td>' +
        '</tr>'
    $('.table.table-pets').append(row)
    $('.table.table-pets tbody tr').eq(index + 1).find('.add, .edit').toggle()
  })

  // Add row on add button click
  $(document).on('click', '.add.pet', function () {
    var empty = false
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
      var addPetData = {}

      input.each(function () {
        $(this).parent('td').html($(this).val())
        addPetData['"' + $(this).text() + '"'] = $(this).val()
      })

      console.log(addPetData)
      $(this).parents('tr').find('.add, .edit').toggle()
      $('.add-new-pet').removeAttr('disabled')
    }
  })
  // Edit row on edit button click
  $(document).on('click', '.edit.pet', function () {

    $(this).parents('tr').find('td:not(:last-child)').each(function () {

      var $th = $(this).closest('table').find('th').eq($(this).index())
      if ($th.text() != 'Pet id') {
        $(this).html('<input type="text" class="form-control" value="' + $(this).text() + '">')
      }
    })
    $(this).parents('tr').find('.add, .edit').toggle()
    $('.add-new-pet').attr('disabled', 'disabled')
  })

  // Delete row on delete button click
  $(document).on('click', '.delete.pet', function () {
    $(this).parents('tr').remove()
    $('.add-new-pet').removeAttr('disabled')
  })

  // =========================== Pets functions =================================== //
});
