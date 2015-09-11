var MAX = 25
document.addEventListener('DOMContentLoaded', function() {
   var req = new XMLHttpRequest();
   req.onload = function(){
      var responseText = req.responseText;
      //Make sure we are logged in
      var newlineregexp = new RegExp('\n', 'g');
      responseText = responseText.replace(newlineregexp, '');
      if(responseText.slice(0,15) == '<!DOCTYPE html>'){
         console.error('not logged in');
         document.getElementById("status").innerText = "You have not signed into scratch. Please sign in to the scratch website and then rerun the extension";
      } else{
         var imgurlreqexp = new RegExp('//cdn2.scratch.mit.edu/','g');
         var userregexp = new RegExp('/users/','g');
         var projectregexp = new RegExp('/projects/','g');
         var addnewline = new RegExp('</a></span>','g');
         var addnewline2 = new RegExp('<span data-tag="time" class="time">','g');

         //Fix links
         responseText = responseText.replace(imgurlreqexp, 'http://cdn2.scratch.mit.edu/');
         responseText = responseText.replace(userregexp, 'http://scratch.mit.edu/users/');
         responseText = responseText.replace(projectregexp, 'http://scratch.mit.edu/projects/');
         //Remove excessive new lines
         responseText = responseText.replace(addnewline2, '<span data-tag="time" class="time">\n');
         responseText = responseText.replace(addnewline,'</a></span>\n');
         document.getElementById("status").innerHTML = responseText;
         console.log(responseText);
      }
   };
   req.onerror = function(e){
      document.getElementById("status").innerHTML = "An error occured: " + e;
      alert("An error occured: " + e);
      console.error("An error occured at" + new Date().getDate() + ": " + e);
   };
   req.open('get', 'http://scratch.mit.edu/messages/ajax/friends-activity/?max=' + MAX, true);
   req.send();
  });
