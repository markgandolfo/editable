window.onload = function() {

  var form = document.getElementById("form_editables");
  var saved_editables = document.getElementById("saved_editables");
  content = document.getElementById("content");
  var filename = document.getElementById("filename");
  var myTab = document.getElementById('myTab');
  var saved = false;
  current_active_tab = 'scratch';

  tabs = {
    'scratch': {
      'content':'Start typing your note in here. It\'ll be stored to your local-storage on your browser. Simple as that!',
      'edited':false
    }
  };

  unnamed = 1;

  window.onresize = function(event) { 
    content.style.height= window.innerHeight - 100;
  }
  content.style.height= window.innerHeight - 100;

  load_open_options();
  add_tab('scratch', {'close': false});

  content.innerHTML = localStorage.getItem('scratch_editable') == null ? tabs['scratch']['content'] : localStorage.getItem('scratch_editable');
  content.focus();

  content.addEventListener('input', function() {
    name = this.getAttribute('data-name');
    tabs[name]['content'] = $(this).html();
    save_tab(name);
  });

  document.querySelectorAll('li[data-action=new]')[0].addEventListener('click', function() {
    $('#newModal').modal('show');
    $('#newModal').on('shown', function() {
      $('#save_new_name').focus();
    });
  });

  $('#newModal').on('hidden', function() {
    content.focus();
  });

  $(save_new_name).on('keyup', function(e){
    if(( e.keyCode == 13 ) && ( document.getElementById('save_new_name').value != "" )){
      create_new_tab_handler();
      e.preventDefault();    
    }
  });

  document.getElementById('save_new_button').addEventListener("click", function() {
    create_new_tab_handler()
  });

  function create_new_tab_handler() {
    var save_new_name = document.getElementById('save_new_name');

    var name = save_new_name.value;
    if(name != "") {
      if(editable_exists(name)) {
        load_editable(name);
      } else {
        add_tab(name, {'close': true});
        switch_tab(name);
        save_tab(name);      
      }
      $('#newModal').modal('hide');
      document.getElementById('save_new_name').value = "";
      add_open_option(name);      
    }
  }

  function editable_exists(name) {
    if(localStorage.getItem(name + '_editables').length > 0) {
      return true;
    }
    return false;
  }

  document.getElementById('save_modal_button').addEventListener('click', function() {
    value = document.getElementById('modal_filename').value;
    if(value != "") {
      current_active_tab = value;
      localStorage.setItem(value + "_editables", content.innerHTML);
      say("Success", value + " saved successfully", "success");
    }
  });

  document.getElementById('save_rename_button').addEventListener('click', function() {
    value = document.getElementById('modal_name').value;
    if(value != "") {
      tabs[value] = {
        'content': tabs[renaming]['content'],
        'edited': false
      };
      delete tabs[renaming];
      $('li[data-name='+renaming+'] a.tab').html(value);
      $('li[data-name='+renaming+'] a').attr('data-name', value);
      $('li[data-name='+renaming+']').attr('data-name', value);
      $('#saved_editables li a[data-name='+renaming+']').html(value);
      $('#saved_editables li a[data-name='+renaming+']').attr('data-name', value);

      localStorage.setItem(value + "_editables", content.innerHTML);
      localStorage.removeItem(renaming + "_editables");
      $('#renameModal').modal('hide');
    }
  });
}

  function load_editable(name) {
    add_tab(name, {'close': true });
    switch_tab(name);
  }

  function add_tab(name, options) {
    if($('.tabs li[data-name='+name+']').length > 0) {
      return false;
    }

    var add_close_link = options['close'] == true ? true : false;
    var tab_content = options['content'] !== undefined ? options['content'] : localStorage.getItem(name + "_editables");

    tabs[name] = {
      'content': tab_content,
      'edited': false
    }
    
    var li=document.createElement("li");
    li.className = "active";
    li.setAttribute('data-name',name);

    var a=document.createElement("a");      
    a.setAttribute('data-name', name);
    a.setAttribute('href', '#');
    a.className = 'tab';
    a.innerHTML = name;
    li.appendChild(a);

    if(add_close_link) {
      var close_link = document.createElement('a');
      close_link.setAttribute('data-name', name);
      close_link.setAttribute('data-action','close');
      close_link.setAttribute('href', '#');
      close_link.innerHTML = " x"
      close_link.addEventListener('click', function() {
        close_tab_and_save(this.getAttribute('data-name'));
      });
      li.appendChild(close_link);      
    }

    $('#myTab li[data-action=new]').before(li);
    a.addEventListener('dblclick', function() {
      renaming = a.getAttribute('data-name');
      $('#renameModal').modal('show');
    });

    a.addEventListener('click', function(e) {
      e.preventDefault();
      switch_tab(a);
    });
  }

  function close_tab_and_save(name) {
    save_tab(name);
    switch_tab('scratch');
    close_tab(name);
    delete tabs[name];
  }

  function close_tab(name) {
    $('.tabs li[data-name='+name+']').remove();
  }

  function isElement(o){
    return (
      typeof HTMLElement === "object" ? o instanceof HTMLElement : //DOM2
      o && typeof o === "object" && o.nodeType === 1 && typeof o.nodeName==="string"
    );
  }

  function save_tab(name) {
    localStorage.setItem(name  + '_editables', tabs[name]['content']);
  }

  function switch_tab(name) {

    if(isElement(name)) {
      name = name.getAttribute('data-name');
    }

    if(tabs[current_active_tab]) {
      tabs[current_active_tab]['content'] = content.innerHTML;  
    }
    
    content.innerHTML = tabs[name]['content'];
    content.setAttribute('data-name', name);
    current_active_tab = name;

    li_tabs = document.querySelectorAll('li[data-name]')
    for (var i = 0; i < li_tabs.length; i++) {
      li_tabs[i].className = 'inactive';
    }

    document.querySelector('li[data-name='+name+']').className = 'active';
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

  function load_open_options() {
    for (var key in localStorage){
      if(key.indexOf("_editables") > 0) {
        var name = key.substring(0,key.indexOf("_editables"));
        add_open_option(name);
      }
    }
  }

  function add_open_option(name) {
    var li=document.createElement("li");
    var a=document.createElement("a");

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