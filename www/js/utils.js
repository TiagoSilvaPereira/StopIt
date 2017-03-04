var utils = {

    showElement: function(elementId) {
        document.getElementById(elementId).style.display = 'block';
    },

    hideElement: function(elementId) {
        document.getElementById(elementId).style.display = 'none';
    },

    hideAllByClass: function(findClass) {
        var objects = document.getElementsByClassName(findClass);
        var i;
        for (i = 0; i < objects.length; i++) {
          var targetObject = objects[i];
          targetObject.style.display = 'none';
        }
    },

    findByClassRemoveClass: function(findClass, removeClass, exceptId) {
        var objects = document.getElementsByClassName(findClass);
        var i;
        for (i = 0; i < objects.length; i++) {
          var targetObject = objects[i];
          if (targetObject.classList.contains(removeClass) && targetObject.id != exceptId) {
            targetObject.classList.remove(removeClass);
          }
        }
    },

    findByIdRemoveClass: function(findId, removeClass) {
        var targetObject = document.getElementById(findId);
        if (targetObject.classList.contains(removeClass)) {
            targetObject.classList.remove(removeClass);
        }
    },

    findByIdAddClass: function(findId, addClass) {
        var targetObject = document.getElementById(findId);
        if (!targetObject.classList.contains(addClass)) {
            targetObject.classList.add(addClass);
        }
    }

}