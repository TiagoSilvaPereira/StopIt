var CreditsController = {

    init: function() {
        document.getElementById('credits-home').addEventListener('click', function(){
            app.showView('menu-view');
        });
    },

    load: function() {
        app.showView('credits-view');
    }

}