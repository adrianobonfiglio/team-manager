exports.helpers = function() {

  hbs.registerHelper("statusHelper", function(val) {
    if(val == 0) {
      console.log(val);
      return new hbs.SafeString("<td><span class='label label-warning'>on time</span><td>")
    }else if(val < 0) {
      return new hbs.SafeString("<td><span class='label label-danger'>late</span></td>")
    }else {
      return new hbs.SafeString("<td><span class='label label-success'>ok</span></td>")
    }
          
  });
}