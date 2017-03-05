var Sound = {

    toggleSound: function() {
        var actualSound = this.isSoundActive();
        window.localStorage['sound'] = !actualSound;
    },

    isSoundActive: function() {
        if(localStorage.getItem("sound") === null) return true;
        return JSON.parse(window.localStorage['sound']);
    }

}