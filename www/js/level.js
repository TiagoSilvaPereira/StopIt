var Level = {

    max_levels : 50,

    getAll: function(success) {
        success(levels);
    },

    get: function(id, success) {

        this.getAll(function(levels){
            levels.forEach(function(level) {
                if(level.id == id) success(level);
            })
        });

    },

    unlockNextLevel: function(actual_id) {
        var last_level = this.getLastLevel();

        if(actual_id >= last_level ) {
            window.localStorage['last_level'] = (actual_id < this.max_levels) ? actual_id + 1 : actual_id;
        }
    },

    getLastLevel: function() {
        return window.localStorage['last_level'] || 1;
    },

    calcPoints: function(current_level, elapsed_time, lifes) {
        var points = 0;

        if(current_level.difficulty == 'easy') points = 100000;
        if(current_level.difficulty == 'normal') points = 150000;
        if(current_level.difficulty == 'hard') points = 200000;

        points -= elapsed_time;

        for(var i = 0; i < lifes; i++) { points += 37568; }

        if(points < 10000) points = 10000;

        points += (Math.random() * 1000) + (2000 - (current_level.speed * 3));
        points = Math.floor(points);

        this.saveRecord(current_level.id, points);

        return points;
    },

    getRecord: function(level_id) {
        var record = window.localStorage['level' + level_id + '_record'];
        if(!record) return 0;
        return record;
    },

    saveRecord: function(level_id, points) {
        var record = this.getRecord(level_id);
        if(points > record) {
            window.localStorage['level' + level_id + '_record'] = points;
        }
    }

}

var LevelsController = {

    init: function() {
        document.getElementById('levels-home').addEventListener('click', function(){
            app.showView('menu-view');
        })
    },

    load: function() {
        var levels = Level.getAll(function(levels) {
            app.showView('levels-view');
            this.makeLevelsList(levels);
        }.bind(this))
    },

    makeLevelsList: function(levels) {
        var levelsContainer = document.getElementById('levels-container');
        levelsContainer.innerHTML = '';

        levels.forEach(function(level) {
            var levelDiv = document.createElement('div');
            levelDiv.innerHTML = level.id;
            levelDiv.level = level.id;
            levelDiv.classList.add('level-item');
            if(level.id <= Level.getLastLevel()) levelDiv.classList.add('active');

            levelDiv.addEventListener('click', function(){
                if(this.level > Level.getLastLevel()) return;
                LevelController.load(this.level);
            })

            levelsContainer.appendChild(levelDiv);
        })
    }

}

var LevelController = {

    first: true,
    success: false,
    gameover: false,
    error: false,
    stopped: false,
    current_level: null,

    start_time: null,
    final_time: null,
    elapsed_time: 0,

    init: function() {

        document.getElementById('level-home').addEventListener('click', function(){
            app.showView('menu-view');
        });

        document.getElementById('next-level').addEventListener('click', function(){
            this.nextLevel();
        }.bind(this));

        document.getElementById('play-again').addEventListener('click', function(){
            this.playAgain();
        }.bind(this));

        document.getElementById('stop-it').addEventListener('click', function(){
            this.stopIt();
        }.bind(this));

    },

    load: function(level_id) {
        this.restartStates();
        this.hideAlerts();

        app.pauseMusic();
        app.showView('loading-view');
        document.getElementById('loading-image').src = 'img/levels/'  + level_id + '.jpg';

        setTimeout(function(){
            app.playMusic();
            this.loadLevel(level_id);
        }.bind(this), 2500);

    },

    loadLevel: function(level_id) {
        Level.get(level_id, function(level) {
            this.current_level = level;
            this.setupAnimator(level);
            this.setupLifes(level);
            this.start_time = new Date();

            app.showView('level-view');

        }.bind(this));
    },

    setupAnimator: function(level) {
        puzzleAnimator.init({
            img: 'img/levels/'  + level.id + '.jpg',
            canvasId: 'canvas',
            difficulty: level.pieces,
            originalImageFrame: level.original_frame,
            maxFrames: level.max_frames,
            speed: level.speed
        });
    },

    setupLifes: function(level) {
        if(level.difficulty == 'easy') {
          this.lifes = 3;
        }else
        if(level.difficulty == 'normal'){
          this.lifes = 4;
        }else{
          this.lifes = 5;
        }

        this.drawLifes();
        max_lifes = this.lifes;
    },

    drawLifes: function() {
        var lifesContainer = document.getElementById('lifes-container');
        lifesContainer.innerHTML = '';

        for(var i = 0; i < this.lifes; i++) {
            var img = document.createElement('img');
            img.src = 'img/heart.png';
            lifesContainer.appendChild(img);
        }
    },

    playAgain: function() {
        this.restartStates();
        this.hideAlerts();

        this.setupLifes(this.current_level);
        this.start_time = new Date();
        this.playPuzzle();
    },

    restartStates: function() {
        this.success = false;
        this.gameover = false;
        this.error = false;
        this.stopped = false;
    },

    hideAlerts: function() {
        utils.hideElement('success-alert');
        utils.hideElement('new-record');
        utils.hideElement('gameover-alert');
        utils.hideElement('play-again-alert');
    },

    nextLevel: function() {
        this.restartStates();
        this.load(this.current_level.id + 1);
    },

    stopIt: function() {
        if(this.first) {
            utils.hideElement('first');
            this.first = false;
        }

        if(this.success || this.gameover || this.error) return;
        
        if(this.stopped){
          this.playPuzzle();
        }else{
          this.stopPuzzle();
          this.verifySuccess();
        }
    },

    playPuzzle: function() {
        this.stopped = false;
        this.error = false;
        puzzleAnimator.play();
    },

    stopPuzzle: function() {
        this.stopped = true;
        puzzleAnimator.stop();
    },

    verifySuccess: function() {
        if(puzzleAnimator.getCurrentFrame() == this.current_level.original_frame) {
          this.gotSuccess();
        }else{
          this.decreaseLifes();
        }
    },

    gotSuccess: function() {
        this.success = true;
        this.final_time = new Date;

        // Elapsed Miliseconds
        this.elapsed_time = this.final_time - this.start_time;
        this.elapsed_time_show = this.elapsed_time / 1000;
        
        Level.unlockNextLevel(this.current_level.id);
        this.points = Level.calcPoints(this.current_level, this.elapsed_time, this.lifes);
        this.record = Level.getRecord(this.current_level.id);

        this.writeSuccessInformation();

        utils.showElement('success-alert');
        utils.showElement('play-again-alert');
    },

    writeSuccessInformation: function() {
        document.getElementById('points').innerHTML = this.points;
        document.getElementById('record').innerHTML = this.record;
        document.getElementById('elapsed-time').innerHTML = this.elapsed_time_show.toFixed(2);
        document.getElementById('lifes').innerHTML = this.lifes;

        if(this.points >= this.record) utils.showElement('new-record');

    },

    decreaseLifes: function() {
        if(this.lifes > 1) {
          this.error = true;
          utils.showElement('wrong');
          setTimeout(function(){
             utils.hideElement('wrong');
            this.playPuzzle();
          }.bind(this), 1000);

        }else{
          this.gameOver();
        }

        this.lifes--;
        this.drawLifes();
    },

    gameOver: function() {
        this.gameover = true;
        utils.showElement('gameover-alert');
        utils.showElement('play-again-alert');
    }

}