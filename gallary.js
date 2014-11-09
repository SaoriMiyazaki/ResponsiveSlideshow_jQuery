$(function(){
    
    var options = {
        thumbUl : $('#thumbnail'),
        mainPhoto : $('#main_photo'),
        parentDiv : $('#photo_container'),
        slideSpeed: 3000,
        fadeSpeed: 500,
        startPlay: true,
        maxWidth : 520, 
        thumbMaxWidth : 80,  
        thumbMinWidth : 65
    };
    
    // 変数作る
    var thumbs = options.thumbUl.find('a'),
        mainPhoto = options.mainPhoto,
        thumbFiles = [],
        mainFiles = [],
        currentNum = 0,
        nextBtn = $('#next'),
        prevBtn = $('#prev'),
        nowPlay = false, 
        timer,
        playBtn = $('#play_btn'),
        stopBtn = $('#stop_btn');       
	
    // ロード時 #main_photo に高さ設定
    window.onload = function(){
        mainPhoto.height(mainPhoto.children('img').outerHeight());
    }
    
    // 親Div サムネイルli メインDiv へ
    options.parentDiv.css('maxWidth', options.maxWidth);
    var liWidth = Math.floor((options.thumbMaxWidth / options.maxWidth) * 100);
    options.thumbUl.children('li').css({
        width : liWidth + '%',
        maxWidth : options.thumbMaxWidth,
        minWidth : options.thumbMinWidth
    });
		
    // サムネイルとメイン画像の配列作る
    for(var i = 0; i < thumbs.length; i++){
        // メインの配列
        mainFiles[i] = $('<img />');
        mainFiles[i].attr({
            src: $(thumbs[i]).attr('href'),
            alt: $(thumbs[i]).children('img').attr('alt')
        });
        mainFiles[i] = mainFiles[i][0];
        // サムネイルの配列
        thumbFiles[i] = $(thumbs[i]).children('img');
        thumbFiles[i] = thumbFiles[i][0];
    }
    
    // メインに最初の一枚を表示しておく
    mainPhoto.prepend(mainFiles[0]);
    // サムネイルの最初の一枚の親 li に current クラスを付ける
    $(thumbFiles[0]).parent().parent().addClass('current');
    
	// ロード時の再生ボタンor停止ボタンの表示
    if(options.startPlay) {
        autoPlay();
        playBtnHide();
        playBtn.hide()
    } else {
        playBtnShow();
    }
    
    ////////// イベントの設定 ////////// 
    
    // サムネイルのクリックイベント
    thumbs.on('click', function(){
        // クリックしたサムネイルが thumbFiles の何番目になるのかを調べる
        currentNum = $.inArray($("img",this)[0], thumbFiles); 
        // 画像入れ替える関数実行
        mainView();
        // 自動再生は止める
        stopPlay();
        // 再生ボタンを表示
        playBtnShow();
        return false;
    });
    
    // プレビューボタンのクリックイベント
    prevBtn.on('click', function(){
        currentNum--;
        if(currentNum < 0){
			currentNum = mainFiles.length - 1;
		}
        // 画像入れ替える関数実行
        mainView();
        // 自動再生は止める
        stopPlay();
        // 再生ボタンを表示
        playBtnShow();
    });
    
    // ネクストボタンのクリックイベント
    nextBtn.on('click', function(){
        currentNum++;
        if(currentNum > mainFiles.length - 1){
			currentNum = 0;
		}
        // 画像入れ替える関数実行
        mainView();
        // 自動再生は止める
        stopPlay();
        // 再生ボタンを表示
        playBtnShow();
    });
    
    // 再生ボタンクリックイベント
    playBtn.on('click', function(){
		if(nowPlay) return;
        //自動再生オン
		autoPlay();	
		// ストップボタン表示
		playBtnHide();
	});
    
    // 停止ボタンクリックイベント
	stopBtn.on('click', function(){
		// 自動再生オフ
        stopPlay();
        // プレイボタン表示
        playBtnShow();
        
	});
    
    // ウィンドウサイズ変更時 mainPhoto の高さも変更
    $(window).on('resize', function(){
        mainPhoto.height(mainPhoto.find('img').outerHeight());
    });
    
    ////////// 関数の設定 //////////
    
    // メイン画像入れ替える関数
    function mainView(){
        // 画像を入れ替えて、古い方の画像はフェードアウトして削除
        mainPhoto.prepend(mainFiles[currentNum]).find('img').show();
        mainPhoto.find('img:not(:first)').stop(true, true).fadeOut(options.fadeSpeed, function(){
		    $(this).remove();
		});
        
        // クリックしたサムネイルへ current クラスを付けかえる
        thumbs.eq(currentNum).parent().addClass('current').siblings().removeClass('current');
    }
	
	// 自動再生の関数
    function autoPlay(){
        // タイマーで繰り返しメイン画像入れ替える処理をする
        nowPlay = true;
		currentNum++;
        if(currentNum > mainFiles.length - 1){
			currentNum = 0;
		}
        mainView();
		timer = setTimeout(function(){
	       autoPlay();
        }, options.slideSpeed);
	}
   
    // 自動再生止める関数
    function stopPlay(){
        clearTimeout(timer);
        nowPlay = false;
    }
	
	// 再生ボタン表示非表示関数
	function playBtnShow(){
		if(nowPlay === false){
			stopBtn.hide();
			playBtn.show();
		}
	}
	function playBtnHide(){
		if(nowPlay === true){
			playBtn.hide();
			stopBtn.show();	
		}
	}
    
});