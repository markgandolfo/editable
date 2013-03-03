window.onload = function() {

  // $('#myModal').modal('show');

  var form = document.getElementById("form_editables");
  var editable_select = document.getElementById("editables");
  var content = document.getElementById("content");
  var filename = document.getElementById("filename");
  var saved = false;
  var first_click = true;

  content.addEventListener("focus", function() {
    if(first_click) {
      first_click = false;
      content.innerHTML = "";  
    }    
  });

  content.addEventListener("onkeypress", function() {
    saved = false;
  });

  content.style.height= window.innerHeight - 100;

  for (var key in localStorage){
    if(key.indexOf("_editables") > 0) {
      var option=document.createElement("option");
      name = key.substring(0,key.indexOf("_editables"));
      option.text = name;
      option.value = name;
      editable_select.add(option,null);
    }
  }

  window.onresize = function(event) { 
    content.style.height= window.innerHeight - 100;
  }

  form.addEventListener("submit", function(e) {
    e.preventDefault();
    if(content.innerHTML == "") {
      load_editable();
    } else if(confirm("Loading new content will replace the content in the editable area. Are you sure you want to do this?")) {
      load_editable();
    }
  });

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

  function load_editable() {
    var key = editable_select.options[editable_select.selectedIndex].text;
    filename.value = key;
    set_title();
    content.innerHTML = localStorage.getItem(key + "_editables");
    first_click = false;
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