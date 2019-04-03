$(document).ready(function () {
  var options = {
    title: {
      text: "Column Chart in jQuery CanvasJS"              
    },
    data: [              
    {
      // Change type to "doughnut", "line", "splineArea", etc.
      type: "column",
      dataPoints: [
        { label: "apple",  y: 10  },
        { label: "orange", y: 15  },
        { label: "banana", y: 25  },
        { label: "mango",  y: 30  },
        { label: "grape",  y: 28  }
      ]
    }
    ]
  };
  
  $("#chartContainer").CanvasJSChart(options);  
  $('[data-toggle="tooltip"]').tooltip()
	var actions = $('table td:last-child').html()
	// Append table with add row form on add new button click
    $('.add-new').click(function () {
    $(this).attr('disabled', 'disabled')
    var index = $('table tbody tr:last-child').index()
    var rowCount = $('table tr').length
        var row = '<tr>' +
            '<td>' + rowCount + '</td>' +
            '<td>' + rowCount + '</td>' +
            '<td><input type="text" class="form-control" name="status" id="status"></td>' +
            '<td>' + new Date($.now()) + '</td>' +
            '<td><input type="text" class="form-control" name="message" id="message"></td>' +
			'<td>' + actions + '</td>' +
        '</tr>'
    	$('table').append(row)		
		$('table tbody tr').eq(index + 1).find('.add, .edit').toggle()
        $('[data-toggle="tooltip"]').tooltip()
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
			$('.add-new').removeAttr('disabled')
		}
  })
	// Edit row on edit button click
	$(document).on('click', '.edit', function () {
    $(this).parents('tr').find('td:not(:last-child)').each(function () {
      $(this).html('<input type="text" class="form-control" value="' + $(this).text() + '">')
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
