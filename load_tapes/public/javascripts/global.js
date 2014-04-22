/**
 * Created by toulon on 4/15/14.
 */

// Tapelist data array for filling in info box
var tapeListData = [];

// DOM Ready =============================================================
$(document).ready(function() {

  // Populate the tape table on initial page load
  populateTable();

});

// Functions =============================================================

// Fill table with data
function populateTable() {

  // Empty content string
  var tableContent = '';
  console.log('In populateTable')
  // jQuery AJAX call for JSON
  $.getJSON( '/tapelist', function( data ) {
  // Stick our tape data array into a tapelist variable in the global object
    tapeListData = data;
    // For each item in our JSON, add a table row and cells to the content string
    $.each(data, function(){
      tableContent += '<tr>';
      tableContent += '<td><a href="#" class="linkshowtape" rel="' + this.label + '">' + this.label + '</td>';
      tableContent += '<td>' + this.action + '</td>';
      tableContent += '<td>' + this.action_date + '</td>';
      tableContent += '<td><a href="#" class="linkdeletetape" rel="' + this._id + '">delete</a></td>';
      tableContent += '</tr>';
    });

    // Inject the whole content string into our existing HTML table
    $('#tapeList table tbody').html(tableContent);
  });
};

// Show Tape Info
function showTapeInfo(event) {
  console.log('In showTapeInfo')
  // Prevent Link from Firing
  event.preventDefault();

  // Retrieve label from link rel attribute
  var thisTapeLabel = $(this).attr('rel');
  console.log('thisTapeLabel ' + thisTapeLabel)
  // Get Index of object based on id value
  var arrayPosition = tapeListData.map(function (arrayItem) {
    return arrayItem.label;
  }).indexOf(thisTapeLabel);
//  alert("Tapelist = " + arrayPosition)
  // Get our Tape Object
  var thisTapeObject = tapeListData[arrayPosition];
  console.log('thisTapeObject ' + thisTapeObject )
  //Populate Info Box
  $('#tapeInfoLabel').text(thisTapeObject.label);
  $('#tapeInfoAction_date').text(thisTapeObject.action_date)
  $('#tapeInfoAction').text(thisTapeObject.action)
  $('#tapeInfoLocation').text(thisTapeObject.location);

};

// Tapename link click
$('#tapeList table tbody').on('click', 'td a.linkshowtape', showTapeInfo);

// Add Tape button click
$('#btnAddTape').on('click', addTape);

// Delete Tape link click
$('#tapeList table tbody').on('click', 'td a.linkdeletetape', deleteTape);

// Update Tape link click
$('#tapeList table tbody').on('click', 'td a.linkupdatetape', updateTape);

// Add Tape
function addTape(event) {
  console.log('In addTape')
  event.preventDefault();

  // Super basic validation - increase errorCount variable if any fields are blank
  var errorCount = 0;
  $('#addTape input').each(function(index, val) {
    if($(this).val() === '') { errorCount++; }
  });

  // Check and make sure errorCount's still at zero
  if(errorCount === 0) {

    // If it is, compile all tape info into one object
    var newTape = {
      'label': $('#addTape fieldset input#inputTapeLabel').val(),
      'action': $('#addTape fieldset input#inputTapeAction').val(),
      'action_date': $('#addTape fieldset input#inputTapeAction_date').val(),
      'location': $('#addTape fieldset select#inputTapeLocation').val()
    }
    console.log(JSON.stringify(newTape));
//    alert(JSON.stringify(newTape))
    // Use AJAX to post the object to our addtape service
    $.ajax({
      type: 'POST',
      data: newTape,
      url: '/addtape',
      dataType: 'JSON'
    }).done(function( response ) {

      // Check for successful (blank) response
      if (response.msg === '') {

        // Clear the form inputs
        $('#addTape fieldset input').val('');

        // Update the table
        populateTable();

      }
      else {

        // If something goes wrong, alert the error message that our service returned
        alert('Error: ' + response.msg);

      }
    });
  }
  else {
    // If errorCount is more than 0, error out
    alert('Please fill in all fields');
    return false;
  }
};

// Update Tape
function updateTape(event) {
  console.log('In updateTape')
  event.preventDefault();

  // Retrieve label from link rel attribute
  var thisTapeLabel = $(this).attr('rel');

  // Get Index of object based on id value
  var arrayPosition = tapeListData.map(function (arrayItem) {
    return arrayItem.label;
  }).indexOf(thisTapeLabel);
//  alert("Tapelist = " + arrayPosition)
  // Get our Tape Object
  var thisTapeObject = tapeListData[arrayPosition];

  //Populate addTape Box
  $('#editrInfoLabel').text(thisTapeObject.action);
  $('#editInfoLocation').text(thisTapeObject.location);

  // Check and make sure errorCount's still at zero
  if(errorCount === 0) {

    // If it is, compile all tape info into one object
    var editTape = {
      'label': $('#addTape fieldset input#inputTapeLabel').val(),
      'action_date': $('#addTape fieldset input#inputTapeDate').val(),
      'action': $('#addTape fieldset input#inputTapeAction').val(),
      'location': $('#addTape fieldset input#inputTapeLocation').val()
    }
    console.log(JSON.stringify(editTape));
//    alert(JSON.stringify(editTape))
    // Use AJAX to post the object to our addtape service
    $.ajax({
      type: 'PUT',
      data: editTape,
      url: '/updatetape',
      dataType: 'JSON'
    }).done(function( response ) {

      // Check for successful (blank) response
      if (response.msg === '') {

        // Clear the form inputs
        $('#addTape fieldset input').val('');

        // Update the table
        populateTable();

      }
      else {

        // If something goes wrong, alert the error message that our service returned
        alert('Error: ' + response.msg);

      }
    });
  }
  else {
    // If errorCount is more than 0, error out
    alert('Please fill in all fields');
    return false;
  }
};

// Delete Tape
function deleteTape(event) {

  event.preventDefault();

  // Pop up a confirmation dialog
  var confirmation = confirm('Are you sure you want to delete this tape?');

  // Check and make sure the tape confirmed
  if (confirmation === true) {

    // If they did, do our delete
    $.ajax({
      type: 'DELETE',
      url: '/deletetape/' + $(this).attr('rel')
    }).done(function( response ) {

      // Check for a successful (blank) response
      if (response.msg === '') {
      }
      else {
        alert('Error: ' + response.msg);
      }

      // Update the table
      populateTable();

    });

  }
  else {

    // If they said no to the confirm, do nothing
    return false;

  }

};



