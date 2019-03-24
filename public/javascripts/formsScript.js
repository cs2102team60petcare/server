function show () {
  // Get Values
  var matric = document.getElementById('email').value
  var name = document.getElementById('name').value
  var faculty = document.getElementById('password').value

  // Alert
  alert('--- Your Input ---\nMatric: ' + matric + '\nName: ' + name + '\nFaculty: ' + faculty)
}

function showPassword () {
  console.log('Showing password')
  var x = document.getElementById('password')
  if (x.type === 'password') {
	  x.type = 'text'
  } else {
	  x.type = 'password'
  }
}
