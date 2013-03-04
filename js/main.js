window.onload = function() {

  // $('#myModal').modal('show');

  var form = document.getElementById("form_editables");
  var saved_editables = document.getElementById("saved_editables");
  var content = document.getElementById("content");
  var filename = document.getElementById("filename");
  var myTab = document.getElementById('myTab');
  var saved = false;
  var first_click = true;

  window.onresize = function(event) { 
    content.style.height= window.innerHeight - 100;
  }
  content.style.height= window.innerHeight - 100;

  content.addEventListener("focus", function() {
    if(first_click) {
      first_click = false;
      content.innerHTML = "";  
    }    
  });

  content.addEventListener("onkeypress", function() {
    saved = false;
  });


  for (var key in localStorage){
    if(key.indexOf("_editables") > 0) {
      var li=document.createElement("li");
      var a=document.createElement("a");

      name = key.substring(0,key.indexOf("_editables"));
      a.setAttribute('data-name', name);
      a.setAttribute('href', '#');
      a.innerHTML = name;
      li.appendChild(a);
      saved_editables.appendChild(li);

      a.addEventListener('click', function(e) {
        e.preventDefault();
          if(content.innerHTML == "") {
            load_editable(this);
          } else if(confirm("Loading new content will replace the content in the editable area. Are you sure you want to do this?")) {
            load_editable(this);
          }        
      });
    }
  }


  // form.addEventListener("submit", function(e) {
  //   e.preventDefault();
  //   if(content.innerHTML == "") {
  //     load_editable();
  //   } else if(confirm("Loading new content will replace the content in the editable area. Are you sure you want to do this?")) {
  //     load_editable();
  //   }
  // });

  $('#myTab a').click(function (e) {
    e.preventDefault();
    $(this).tab('show');
    console.log(this);
  })

  document.getElementById("save").addEventListener("click", function () {
    if(filename.value != "") {
      localStorage.setItem(filename.value + "_editables", content.innerHTML);
      saved = true;
      say("Success", filename.value + " saved successfully", "success");
    } else {
      $('#nameModal').modal('show');
    }
  });

  document.getElementById("new").addEventListener("click", function() {
    if(saved || content.innerHTML != "" && confirm("You'll loose any changes you've made that are unsaved! Are you sure?")) {
      content.innerHTML = "";
      editable_select.selectedIndex = 0;
      filename.value = "";
      set_title();
    }
  });

  document.getElementById('save_modal_button').addEventListener('click', function() {
    value = document.getElementById('modal_filename').value;
    if(value != "") {
      filename.value = value;
      set_title();
      $('#nameModal').modal('hide');
      localStorage.setItem(filename.value + "_editables", content.innerHTML);
      saved = true;
      say("Success", filename.value + " saved successfully", "success");
    }
  });

  function load_editable(that) {
    key = that.getAttribute('data-name');
    add_tab(that);
    content.innerHTML = localStorage.getItem(key + "_editables");
    first_click = false;
  }

  function add_tab(that) {
      name = that.getAttribute('data-name');
      var li=document.createElement("li");
      var a=document.createElement("a");

      li.className = "active"
      a.setAttribute('data-name', name);
      a.setAttribute('href', '#');
      a.innerHTML = name;

      li.appendChild(a);
      myTab.appendChild(li);

      a.addEventListener('click', function(e) {
        e.preventDefault();
        
      });
  }

  function set_title() {
    if(filename.value == "") {
      document.title = "Content Editable";
    } else {
      document.title = filename.value + " - Content Editable";
    }
  }

  function say(title,message,color) {
    var e = document.createElement('div');
    e.innerHTML = "<h4>"+title+"</h4>" + message;
    e.className = color == "success" ? "alert alert-success" : "alert alert-error";
    document.getElementById("navbar").appendChild(e);
    setTimeout( function(){
      e.innerHTML = "";
      e.className = "";
    },5000);
  }

}