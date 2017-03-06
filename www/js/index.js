
var app = {
    
    admobid: {},
    music: document.getElementById("music"),
    
    playMusic: function() {
        var isActive = Sound.isSoundActive();
        if(isActive) {
            this.music.play();
        }
    },

    pauseMusic: function() {
        this.music.pause();
        this.music.currentTime = 0;
    },

    showView: function(viewId) {
        utils.hideAllByClass('view');
        utils.showElement(viewId);
    },
    hideView: function(viewId) {
        utils.hideElement(viewId);
    },
    initialize: function() {

        var attachFastClick = Origami.fastclick;
        attachFastClick(document.body);

        MenuController.init();
        LevelsController.init();
        LevelController.init(); 
        CreditsController.init(); 

        this.playMusic();

        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    onDeviceReady: function() {
        // App - ca-app-pub-3878500594184986~1881636157
        if( /(android)/i.test(navigator.userAgent) ) { // for android & amazon-fireos
            this.admobid = {
              banner: 'ca-app-pub-3878500594184986/9125701357',
              interstitial: 'ca-app-pub-3878500594184986/3358369353'
            };
        }

        if(AdMob){
            
            AdMob.createBanner({
                adId: this.admobid.banner,
                position: AdMob.AD_POSITION.BOTTOM_CENTER,
                autoShow: true ,
                //isTesting: true, // TODO: remove this line when release
            });

        }
    },

    prepareInterstitial: function() {
        if(AdMob) {
            AdMob.prepareInterstitial({
                adId: this.admobid.interstitial,
                //isTesting: true, // TODO: remove this line when release
                autoShow: false
            });
        }
    },

    showInterstitial: function() {
        if(AdMob) {
            AdMob.showInterstitial();
        }
    }
};

var AdMob = null;
app.initialize();