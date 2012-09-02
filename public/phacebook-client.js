function getParameterByName(name)
{
  name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
  var regexS = "[\\?&]" + name + "=([^&#]*)";
  var regex = new RegExp(regexS);
  var results = regex.exec(window.location.search);
  if(results == null)
    return "";
  else
    return decodeURIComponent(results[1].replace(/\+/g, " "));
}

// posts our Push action to the FACEPAGES
function postPush(access_token)
{
    FB.api(
      '/me/thephantomphacebook:push',
      'post',
      { button: 'http://thepaulbooth.com/phacebook/button.html',
      access_token: access_token },
      function(response) {
         if (!response || response.error) {
            //alert('Error occured');
            console.log(JSON.stringify(response.error, undefined, 2));
         } else {
            alert('Push was successful! Action ID: ' + response.id);
         }
      });
}