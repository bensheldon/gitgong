// SETUP
$(document).ready(function() {
  // Tooltips
  $("[rel=tooltip]").tooltip();

  // Tablesorter
  $("#endpoints").tablesorter({});
});

// SETUP
$(document).ready(function() {
  $('#repos input[type=checkbox]').change(function(){
    var self = this;
    if (this.checked) {
      // Subscribe
      $.post('/repo/'+ $(self).attr('name') + '/subscribe')
        .success(function(data, status) {
          console.log("Subscribed to", $(self).attr('name'))
        })
        .error(function(data, status) {
          console.log(status)
        });
    }
    else {
      $.post('/repo/'+ $(self).attr('name') + '/unsubscribe')
        .success(function(data, status) {
          console.log("Unsubscribed from", $(self).attr('name'))
        })
        .error(function(data, status) {
          console.log(status)
        });
    }
  })
});





// SOCKET.IO
$(document).ready(function() {
  var audioQ = [];
  var socket = io.connect('/');
  socket.on('info', function (data) {
    console.log(data);
  });

  socket.on('newpush', function (push) {
    var row  = '<div class="row fluid"><div class="span12 well">'
             + '<strong><a href="http://github.com/users/'+push.user+'">' + push.user + "</a></strong>"
             + " pushed "
             + "<strong>" + push.commitCount + "</strong>"
             + " commits to "
             + "<strong>" + push.repo + "</strong>"
             + "</div></div>"

    $("div#updates").prepend(row);
    $('div#audio').append('<audio src="/assets/gong.mp3" autoplay controls style="display:none"></audio>');
    $('audio').on('ended', function(event) {
      $(this).remove();
    });
    console.log(push);
  });

  socket.on('serviceRequest', function (serviceRequest) {
    var row  = "<tr>"
               + "<td>" + serviceRequest.endpoint + "</td>"
               + "<td>" + serviceRequest.service_name + "</td>"
               + "<td>" + serviceRequest.description + "</td>";
    if (serviceRequest.media_url) {
        console.log( serviceRequest.media_url);
        row +=  '<td><img src="' + serviceRequest.media_url + '" /></td>';
    }
    else {
        row += '<td></td>';
    }
    row += "<td>" + serviceRequest.requested_datetime + "</td>";
    row += '</tr>';


  });
});