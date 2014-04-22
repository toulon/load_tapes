/**
 * Created by toulon on 4/18/14.
 */
function logStuff (userData) {
  var util = require('util');


  console.log("In logSuff")
  if ( typeof userData === "string")
  {
    console.log(userData);
  }
  else if ( typeof userData === "object")
  {
    for (var item in userData) {
      console.log(item + ": " + userData[item]);
    }

  }
  else if ( typeof userData === "function")
  {
//    console.log(userData);
    console.log(util.inspect (userData))
  }
  else
  {
    console.log(userData + " is type of " + typeof userData)

  }

}
exports.logger = logStuff

