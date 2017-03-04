var MenuController = {

    init: function() {
        app.showView('menu-view');
        
        document.getElementById('start-game').addEventListener('click', function(){
            MenuController.startGame();
        });

        document.getElementById('continue-game').addEventListener('click', function(){
            MenuController.continueGame();
        });

        document.getElementById('select-level').addEventListener('click', function(){
            MenuController.selectLevel(this.level);
        });

        document.getElementById('load-credits').addEventListener('click', function(){
            MenuController.loadCredits();
        });
    },

    startGame: function() {
        LevelController.load(1);
    },

    continueGame: function() {
        var last_level = Level.getLastLevel();
        LevelController.load(last_level);
    },

    selectLevel: function(level) {
        LevelsController.load();
    },

    loadCredits: function() {
        CreditsController.load();
    }

}