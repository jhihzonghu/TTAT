$(function () {

    /*
     * Slideshow
     */
    $('.slideshow').each(function () {

    //
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

        var $container = $(this),                                 // a
            $slideGroup = $container.find('.slideshow-slides'),   // b
            $slides = $slideGroup.find('.slide'),                 // c
            $nav = $container.find('.slideshow-nav'),             // d
            $indicator = $container.find('.slideshow-indicator'), // e
           // SlideShow內各元素的jQuery物件
            // a SlideShow整體的container
            // b 所有Slide的彙整(SlideGroup)
            // c 各個Slide
            // d 瀏覽鏈結(Prev/Next)
            // e 指標鏈結(Dot)

            slideCount = $slides.length, // Slide的個數
            indicatorHTML = '',          // 指標鏈結的內容
            currentIndex = 0,            // 目前Slide的索引值
            duration = 500,              // 轉換至下個Slide所需的動畫時間
            easing = 'easeInOutExpo',    // 轉換至下個Slide的easing種類
            interval = 7500,             // 自動切換的時間
            timer;                       // 用以儲存timer


    // HTML元素的配置、建立與插入
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

        // 決定各個Slide的位置
        // 並建立對應的指標鏈結
        $slides.each(function (i) {
            $(this).css({ left: 100 * i + '%' });
            indicatorHTML += '<a href="#">' + (i + 1) + '</a>';
        });

        // 插入指標鏈結的內容
        $indicator.html(indicatorHTML);


    // 函數定義
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

        // 用以顯示任意Slide的函數
        function goToSlide (index) {
            // SlideGroup配合目標位置移動
            $slideGroup.animate({ left: - 100 * index + '%' }, duration, easing);
            // 記錄當前Slide的索引值
            currentIndex = index;
            // 更新瀏覽鏈結、指標鏈結的狀態
            updateNav();
        }

        // 依照Slide狀態更新更新瀏覽鏈結、指標鏈結的函數
        function updateNav () {
            var $navPrev = $nav.find('.prev'), // Prev (前進) 鏈結
                $navNext = $nav.find('.next'); // Next (後退) 鏈結
            // 若為第一個Slide，則將Prev瀏覽鏈結設定無效
            if (currentIndex === 0) {
                $navPrev.addClass('disabled');
            } else {
                $navPrev.removeClass('disabled');
            }
            // 若為最後的Slide，則將Next瀏覽鏈結設定無效
            if (currentIndex === slideCount - 1) {
                $navNext.addClass('disabled');
            } else {
                $navNext.removeClass('disabled');
            }
            // 將當前Slide的指標鏈結設定無效
            $indicator.find('a').removeClass('active')
                .eq(currentIndex).addClass('active');
        }

        // 起始timer的函數
        function startTimer () {
            //利用變數interval設定經過多久的時間就執行處理 
            timer = setInterval(function () {
                // 以當前Slide的索引值決定下個要顯示的Slide
                // 若為最後的Slide則顯示第一張Slide
                var nextIndex = (currentIndex + 1) % slideCount;
                goToSlide(nextIndex);
            }, interval);
        }

        // 停止tismer的函數
        function stopTimer () {
            clearInterval(timer);
        }


    // 事件註冊
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

        // 點擊瀏覽鏈結後顯示對應的Slide
        $nav.on('click', 'a', function (event) {
            event.preventDefault();
            if ($(this).hasClass('prev')) {
                goToSlide(currentIndex - 1);
            } else {
                goToSlide(currentIndex + 1);
            }
        });

        // 點擊指標鏈結後顯示對應的Slide
        $indicator.on('click', 'a', function (event) {
            event.preventDefault();
            if (!$(this).hasClass('active')) {
                goToSlide($(this).index());
            }
        });

        // 滑鼠移入時暫停timer，移出則啟動timer
        $container.on({
            mouseenter: stopTimer,
            mouseleave: startTimer
        });


    // 啟動SlideShow
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

        // 顯示最初的Slide
        goToSlide(currentIndex);

        // 啟動timer
        startTimer();

    });

    /*
     * Sticky header
     */
    $('.page-header').each(function () {

        var $window = $(window), // Window 物件
            $header = $(this),   // header

            // header的複本
            $headerClone = $header.contents().clone(),

            // header複本的container
            $headerCloneContainer = $('<div class="page-header-clone"></div>'),

            
            //從HTML上側到header底部的距離 = header的top位置 + header的高度
            threshold = $header.offset().top + $header.outerHeight();

        // 將header的複本插入container
        $headerCloneContainer.append($headerClone);

        // 將container插入body的最後
        $headerCloneContainer.appendTo('body');

        
        // 針對捲動時的執行處理，次數限制為每秒最多15次
        $window.on('scroll', $.throttle(1000 / 15, function () {
            if ($window.scrollTop() > threshold) {
                $headerCloneContainer.addClass('visible');
            } else {
                $headerCloneContainer.removeClass('visible');
            }
        }));

        // 觸發捲動事件，決定初始位置
        $window.trigger('scroll');
    });

    /*
     * Tabs
     */
    $('.work-section').each(function () {

        var $container = $(this),                            // a
            $navItems = $container.find('.tabs-nav li'),     // b
            $highlight = $container.find('.tabs-highlight'); // c
        // 將Tab的各元素轉為jQuuery物件
        // a 包含Tab和Panel的整體container
        // b Tab列表
        // c 選択中Tab的Highlight

        // 執行jQuery UI Tabs
        $container.tabs({

             // 設定為不顯示時的動畫
            hide: { duration: 250 },

            // 設定為顯示時的動畫
            show: { duration: 125 },

            // 讀取時與選擇時Highlight位置的調整
            create: moveHighlight,
            activate: moveHighlight
        });

        // 調整Highlight位置的函數
        function moveHighlight (event, ui) {
            var $newTab = ui.newTab || ui.tab,  // 新選擇Tab的jQuery物件
                left = $newTab.position().left; // 新選擇Tab的left

            // Highlight位置的動畫
            $highlight.animate({ left: left }, 500, 'easeOutExpo');
        }
    });

    /*
     * Back-toTop button (Smooth scroll)
     */
    $('.back-to-top').on('click', function () {

        // 執行Smooth Scroll Plug-in
        $.smoothScroll({
            easing: 'easeOutExpo', // easing的種類
            speed: 500             // 所需時間
        });
    });

    // Google Maps
    function initMap () {
        var mapContainer = document.getElementById('map-container'),
            mapImageSrc = mapContainer.getElementsByTagName('img')[0].getAttribute('src'),
            mapParams = decodeURIComponent(mapImageSrc.split('?')[1]).split('&'),
            mapData = {},
            mapStyleName = 'Mono',
            mapStyles = [
                {
                    featureType: 'all',
                    elementType: 'all',
                    stylers: [
                        { visibility: 'on' },
                        { hue: '#105ea7' },
                        { saturation: -100 },
                        { invert_lightness: true }
                    ]
                },
                {
                    elementType: 'labels.icon',
                    stylers: [
                        { visibility: 'off' }
                    ]
                }
            ],
            latLng,
            mapOptions,
            map,
            marker,
            markerLatLng,
            i,
            len,
            pair;
        for (i = 0, len = mapParams.length; i < len; i++) {
            pair = mapParams[i].split('=');
            mapData[pair[0]] = pair[1];
        }
        markerLatLng = mapData.markers? mapData.markers.split(','): null;
        latLng = mapData.center? mapData.center.split(','): markerLatLng;
        mapOptions = {
            center: new google.maps.LatLng(latLng[0], latLng[1]),
            disableDefaultUI: true,
            panControl: true,
            zoom: +mapData.zoom || 16,
            zoomControl: true,
            zoomControlOptions: {
                style: google.maps.ZoomControlStyle.SMALL
            }
        };
        map = new google.maps.Map(mapContainer, mapOptions);
        map.mapTypes.set(mapStyleName, new google.maps.StyledMapType(mapStyles, { name: mapStyleName }));
        map.setMapTypeId(mapStyleName);
        if (mapData.markers) {
            marker = new google.maps.Marker({
                position: new google.maps.LatLng(markerLatLng[0], markerLatLng[1]),
                map: map
            });
        }        
    }

    initMap();

});
