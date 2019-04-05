$(document).ready(function () {
    
    $('[data-toggle="tooltip"]').tooltip()
      var actions = $('table td:last-child').html()
      
      // Delete row on delete button click
      $(document).on('click', '.delete', function () {
      $(this).parents('tr').remove()
          $('.add-new').removeAttr('disabled')
      })
  })