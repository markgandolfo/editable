window.onload = function() {

  var form = document.getElementById("form_editables");
  var saved_editables = document.getElementById("saved_editables");
  content = document.getElementById("content");
  var filename = document.getElementById("filename");
  var myTab = document.getElementById('myTab');
  var saved = false;
  current_active_tab = 'new';

  tabs = {
    'new': {
      'content':'Start typing your note in here. It\'ll be stored to your local-storage on your browser. Simple as that!',
      'edited':false
    }
  };

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

      var name = key.substring(0,key.indexOf("_editables"));
      a.setAttribute('data-name', name);
      a.setAttribute('href', '#');
      a.innerHTML = name;
      li.appendChild(a);
      saved_editables.appendChild(li);

      a.addEventListener('click', function(e) {
        e.preventDefault();
        load_editable(this.getAttribute("data-name"));
      });
    }
  }

  $('#myTab a').click(function (e) {
    e.preventDefault();
    switch_tab(this);
  });
  content.innerHTML = tabs['new']['content'];

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

  function load_editable(name) {
    add_tab(name);
    switch_tab(name);
  }

  function add_tab(name) {
      tabs[name] = {'content':localStorage.getItem(name + "_editables"), 'edited':false};

      var li=document.createElement("li");
      li.className = "active"

      var a=document.createElement("a");      
      a.setAttribute('data-name', name);
      a.setAttribute('href', '#');
      a.innerHTML = name;
      li.appendChild(a);

      var close_link = document.createElement('a');
      close_link.setAttribute('data-name', name);
      close_link.setAttribute('data-action','close');
      close_link.setAttribute('href', '#');
      close_link.innerHTML = " x"
      close_link.addEventListener('click', function() {
        close_tab_if_saved(name);
      });
      a.appendChild(close_link);

      myTab.appendChild(li);

      a.addEventListener('click', function(e) {
        e.preventDefault();
        switch_tab(a);
      });
  }

  function close_tab_if_saved(name) {
    if(!tabs[name]['edited']) {
      if(confirm("would you like to save first?")) {
        save_tab(name);
      }
    } 
  }

function isElement(o){
  return (
    typeof HTMLElement === "object" ? o instanceof HTMLElement : //DOM2
    o && typeof o === "object" && o.nodeType === 1 && typeof o.nodeName==="string"
);
}


  function save_tab(name) {
    localStorage.setItem(name, tabs[name]['content']);
  }

  function switch_tab(name) {

    if(isElement(name)) {
      name = name.getAttribute('data-name');
    }

    tabs[current_active_tab]['content'] = content.innerHTML;
    content.innerHTML = tabs[name]['content'];
    content.setAttribute('data-name', name);
    current_active_tab = name;
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