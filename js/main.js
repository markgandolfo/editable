window.onload = function() {
  var saved_editables = document.getElementById("saved_editables");
  var content = document.getElementById("content");
  var current_active_tab = 'scratch';

  tabs = {
    'scratch': {
      'content':'Start typing your note in here. It\'ll be stored to your local-storage on your browser. Simple as that!',
      'edited':false
    }
  };

  /* 
    When the page loads, lets set up the page and scaffold ContentEditable
  */

  //  Set up the content editable height, and set an event to resize on window resize
  content.style.height= window.innerHeight - 100;
  window.onresize = function(event) { 
    content.style.height= window.innerHeight - 100;
  }
  
  // Load all the open options and set up the initial scratch pad(tab
  load_open_options();

  // Load the scratch pad if it exists, or else default to the default message from the "tabs" object above
  add_tab('scratch', {'close': false});
  content.innerHTML = localStorage.getItem('scratch_editable') == null ? tabs['scratch']['content'] : localStorage.getItem('scratch_editable');
  
  // Focus the cursor on the content editable area
  content.focus();

  // Event for listening for any type of input on the page, this will only work in very new browsers.. 
  content.addEventListener('input', function() {
    name = this.getAttribute('data-name');
    tabs[name]['content'] = $(this).html();
    save_tab(name);
  });

  /*
    Add new Tab 
   */

  // Event Handler for the new tab "button"
  document.querySelectorAll('li[data-action=new]')[0].addEventListener('click', function() {
    $('#newModal').modal('show');
    $('#newModal').on(
      'shown', function() {
        $('#save_new_name').focus();
      },
      'hidden', function() {
        content.focus();
      });
  });

  // for the New Tab Modal, listen for an enter keypress on the input field, catch it and simuilate the "save" button
  $(save_new_name).on('keyup', function(e){
    if(( e.keyCode == 13 ) && ( document.getElementById('save_new_name').value != "" )){
      create_new_tab_handler();
      e.preventDefault();    
    }
  });

  // Save button on the New Tab Modal
  document.getElementById('save_new_button').addEventListener("click", function() {
    create_new_tab_handler()
  });

  // Function for the submission of the New Tab Modal
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

  /*
    Rename a Tab 
   */
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


  function editable_exists(name) {
    if(localStorage.getItem(name + '_editables').length > 0) {
      return true;
    }
    return false;
  }

}

  function load_editable(name) {
    add_tab(name, {'close': true });
    switch_tab(name);
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
