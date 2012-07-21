// SETUP
$(document).ready(function() {
  // Tooltips
  $("[rel=tooltip]").tooltip();

  // Tablesorter
  $("#endpoints").tablesorter({});

  // TimeAgo - https://github.com/rmm5t/jquery-timeago/blob/master/locales/jquery.timeago.en.js
  jQuery.timeago.settings.strings = {
    prefixAgo: null,
    prefixFromNow: null,
    suffixAgo: "",
    suffixFromNow: "from now",
    seconds: "just now",
    minute: "1 minute ago",
    minutes: "%d minutes ago",
    hour: "1 hour ago",
    hours: "%d hours ago",
    day: "1 day ago",
    days: "%d days ago",
    month: "1 month ago",
    months: "%d months ago",
    year: "a year ago",
    years: "%d years ago",
    wordSeparator: " ",
    numbers: []
  };
  $("time.timeago").timeago();
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
    console.log(push);
    var update  = '<li>'
             + '<strong><a href="http://github.com/users/'+push.user+'">' + push.user + "</a></strong>"
             + " pushed "
             + "<strong>" + push.commitCount + "</strong>"
             + " commits to ";
  if (!push.private) {

  }
  else {
    update += '<strong>' + push.repo + '</strong> <i class="icon-lock">'
  }
             
    update += '<span class="label label-info pull-right"><time class="timeago" datetime="' + moment(push['created_at']).format() + '">just now</time></span>'
            + "</li>";

    console.log(update);

    $("ul#updates-list").prepend(update).timeago();
    $('div#audio').append('<audio src="/assets/gong.mp3" autoplay controls style="display:none"></audio>');
    $('audio').on('ended', function(event) {
      $(this).remove();
    });
    
  });

});