/*Copyright (c) 2014 Noam Raz and Matan Kotler-Berkowitz. All rights reserved.*/
(function() {
    var items = [];
    var wrapAll = document.getElementById("wrap-all");
    function Item(label, parent) {
        var _this = this;
        this.label = label;
        this.finish = function() {
            _this.ui.wrap.textContent = "Done!";
            setTimeout(function() {
                parent.splice(parent.indexOf(_this), 1);
                _this.ui.wrap.parentNode.removeChild(_this.ui.wrap);
                updateStorage();
            }, 500);
        }
        this.ui = {
            wrap: document.createElement("DIV"),
        }
        this.ui.wrap.textContent = label;
        this.ui.wrap.title = "Mark as done";
        this.ui.wrap.onclick = this.finish;
    }
    document.getElementById("add-item").onsubmit = function(e) {
        e.preventDefault();
        var val = this.elements[0].value.trim();
        if(val) addItem(val);
        this.reset();
    };
    function addItem(val) {
        var item = new Item(val, items);
        items.unshift(item);
        wrapAll.insertBefore(item.ui.wrap, wrapAll.firstChild);
        updateStorage();
    }
    function updateStorage() {
        chrome.storage.sync.set({
            items: (function() {
                var itemText = [];
                for(var i = 0; i < items.length; i++) {
                    itemText.unshift(items[i].label) //Use "unshift" to get items in correct order
                }
                return itemText;
            })()
        });
    }
    chrome.storage.sync.get("items", function(obj) {
        var items = obj.items || [];
        for(var i = 0, len = items.length; i < len; i++) addItem(items[i]);
    });
})()