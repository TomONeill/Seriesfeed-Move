// ==UserScript==
// @name         Seriesfeed Move
// @namespace    http://www.seriesfeed.com
// @version      1.0
// @description  Allows you to move and position the cards on the homepage.
// @updateURL 	 https://github.com/TomONeill/Seriesfeed-Move/raw/master/SeriesfeedMove.user.js
// @match        http://www.seriesfeed.com/
// @run-at       document-start
// @grant        unsafeWindow
// @grant        GM_getValue
// @grant        GM_setValue
// @require      http://code.jquery.com/jquery-1.12.2.min.js
// @require      http://code.jquery.com/ui/1.11.4/jquery-ui.min.js
// @author       Tom
// @copyright    2016+, Tom
// ==/UserScript==
/* jshint -W097 */
'use strict';

$(function() {
    // Identify the columns.
    var col1 = $(".row .col-md-6:eq(0)");
    var col2 = $(".row .col-md-6:eq(1)");
    
    // Add appropriate classes to the columns.
    col1.addClass("sortable1");
    col2.addClass("sortable2");
    
    // Make cards draggable to either column.
    col1.addClass("connectedSortable");
    col2.addClass("connectedSortable");
    
    // Find each card and add their state + make them serializable.
    $('.sortable1 > div').each(function(i, obj) {
        addSortableData($(this), 'i', i);
    });
    $('.sortable2 > div').each(function(i, obj) {
        addSortableData($(this), 'j', i);
    });
    
    function addSortableData(item, type, num) {
        item.addClass("ui-state-default");
        item.attr('id', type + "_" + (num+1));
        var cardContent = item.find('.blog-left');
        cardContent.prepend('<div class="handle" />');
        item.find('.handle').css({
            'padding-bottom': '75px',
            'height': '80px',
            'position': 'absolute',
            'left': '0',
            'right': '0'
        });
    }
    
    // Load the cards in the right order.
    restoreOrder();
    
    // Change cursor on card's handle.
    $(".handle").css('cursor', 'move');
    
    // Actual sorting.
    $(".sortable1, .sortable2").sortable({
        connectWith: ".connectedSortable",
        handle: '.handle',
        revert: true,
        cursor: "move",
        start: function(e, ui) {
            $(this).find('.blog-left').removeClass('animated');
        },
        update: function (event, ui) {
            var cooked1 = [];
            var cooked2 = [];
            $(".sortable1").each(function(index, domEle) {
                    cooked1[index] = $(domEle).sortable('toArray', {key: 'i', attribute: 'id'});
                }
            );
            $(".sortable2").each(function(index, domEle) {
                    cooked2[index] = $(domEle).sortable('toArray', {key: 'j', attribute: 'id'});
                }
            );
            GM_setValue("blockOrder1", cooked1.join('|'));
            GM_setValue("blockOrder2", cooked2.join('|'));
        }
    });
    
    function restoreOrder() {
        var order1 = GM_getValue("blockOrder1");
        var order2 = GM_getValue("blockOrder2");
        if (!order1 || !order2) return;
        
        var SavedID1 = order1.split('|');
        var SavedID2 = order2.split('|');
        
        for (var u=0, ul=SavedID1.length; u < ul; u++) {
            SavedID1[u] = SavedID1[u].split(',');
        }
        for (var u=0, ul=SavedID2.length; u < ul; u++) {
            SavedID2[u] = SavedID2[u].split(',');
        }
        for (var Scolumn=0, n = SavedID1.length; Scolumn < n; Scolumn++) {
            for (var Sitem=0, m = SavedID1[Scolumn].length; Sitem < m; Sitem++) {
                if (SavedID1[Scolumn][Sitem].indexOf("i") >= 0) {
                    $(".sortable1").eq(Scolumn).append($(".sortable1").children("#" + SavedID1[Scolumn][Sitem]));
                } else {
                    $(".sortable1").eq(Scolumn).append($(".sortable2").children("#" + SavedID1[Scolumn][Sitem]));
                }
            }
        }
        for (var Scolumn=0, n = SavedID2.length; Scolumn < n; Scolumn++) {
            for (var Sitem=0, m = SavedID2[Scolumn].length; Sitem < m; Sitem++) {
                if (SavedID2[Scolumn][Sitem].indexOf("i") >= 0) {
                    $(".sortable2").eq(Scolumn).append($(".sortable1").children("#" + SavedID2[Scolumn][Sitem]));
                } else {
                    $(".sortable2").eq(Scolumn).append($(".sortable2").children("#" + SavedID2[Scolumn][Sitem]));
                }
                
            }
        }
    }
});
