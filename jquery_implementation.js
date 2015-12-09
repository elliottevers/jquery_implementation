(function(root){

  var loaded = false;

  var callbacks = [];

  window.onload=function(){
    loaded = true;
    callbacks.forEach(function(f){ f(); });
  }

  var addToCallbacks = function(f){
    if(!loaded){
      callbacks.push(f);
    } else {
      f();
    }
  };

  root.j = function(argument){

    var returnValue;

    if (typeof(argument) === "object") {
      returnValue = new DomNodeCollection([argument]);
    } else if (typeof(argument) === "string") {
      var nodes = [].slice.call(document.querySelectorAll(argument), 0);
      return new DomNodeCollection(nodes);
    } else if (typeof(argument) === "function") {
      addToCallbacks(argument);
    }

    return returnValue;
  };

  var DomNodeCollection = function DomNodeCollection(nodes){
    this.nodes = Array.prototype.slice.call(nodes);
  };

  DomNodeCollection.prototype = {
    each: function(callback){
      this.nodes.forEach(callback);
    },

    on: function(eventName, callback){
      this.each(function(node){
        node.addEventListener(eventName, callback);
      });
    },

    off: function(eventName, callback){
      this.each(function(node){
        node.removeEventListener(eventName, callback);
      });
    },

    addClass: function(c){
      this.each(function(node){
        node.classList.add(c);
      });
    },

    removeClass: function(c){
      this.each(function(node){
        node.classList.remove(c);
      });
    },

    find: function(selector){
      var nodes = [];
      var nodeList = document.querySelectorAll(selector);
      nodes = nodes.concat([].slice.call(nodeList));
      return new DomNodeCollection(nodes);
    },

    html: function(html){
        if(this.nodes.length > 0){
          return this.nodes[0].innerHTML;
        }
    },

    text: function(){
      return this.nodes[0].textContent.trim();
    },

    backgroundColor: function(color){
      this.each(function(node){
        node.style.backgroundColor = color;
      });
    },

    append: function(children){
      if (typeof children === "string") {
        this.each(function (node) {
          node.innerHTML += children;
        });
      } else if (children instanceof DomNodeCollection) {
        var node = this.nodes[0];
        children.each(function (childNode) {
          node.appendChild(childNode);
        });
      }
    },

    remove: function(){
      this.each(function(node){
        node.parentNode.removeChild(node);
      });
    },

    attr: function(key, value){
      if(typeof value === "string"){
        this.each(function(node){
          node.setAttribute(key, value);
        });
      } else {
        return this.nodes[0].getAttribute(key);
      }
    },

    children: function(){
      var nodes = [];
      this.each(function(node){
        var nodeList = node.children;
        nodes = nodes.concat([].slice.call(nodeList));
      });
      return new DomNodeCollection(nodes);
    },

    parent: function(){
      var nodes = [];
      this.each(function(node){
        nodes.push(node.parentNode);
      });
      return new DomNodeCollection(nodes);
    },

    length: function(){
      return this.nodes.length;
    }
  };

})(this);
