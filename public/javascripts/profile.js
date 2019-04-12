$(document).ready(function () {
  console.log('Hello profile page')
  $('.edit-profile').click(function () {
    $(this).attr('disabled', 'disabled')
    var userDetails = $('.user-details').find('.edit')

    userDetails.each(function () {
      var inputName = $(this).attr('id')
      if (inputName != 'role') {
        var inputChange = '<input type="text" name="' + inputName + '"' + 'value = "' + $(this).text().trim() + '">'
        $(this).html(inputChange)
      }
    })
    $('#updateProfile').show()
  })

  $('#updateProfile').click(function () {
    var userInputs = $(this).parents('div').find('input[type="text"]')
    var userDataUpdate = {}
    userInputs.each(function () {
      var key = $(this).attr('name')
      var val = $(this).val()
      userDataUpdate[key] = val
    })
    console.log(userDataUpdate)
    $.ajax({
      url: 'profile/updateProfile',
      type: 'POST',
      data: userDataUpdate,
      success: function (res) {
        var result = res.Updated
        if (!result) {
          alert('Profile not updated')
        } else {
          alert('Profile updated')
          userInputs.each(function () {
            var val = $(this).val()
            $(this).html(val)
          })
        }
      }
    })
  })
})
