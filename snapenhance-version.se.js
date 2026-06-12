// ==SE_module==
// @name         rgb_pixel_text
// @displayName  RGB Pixel Text
// @description  Makes your Snapchat chat text RGB with a pixelated effect
// @version      1.0.0
// @author       YOUR_USERNAME
// @minSnapchatVersion 106822
// @minSEVersion 1.0.0
// @permissions  unsafe-classloader
// ==/SE_module==

var module = {};

module.onSnapMainActivityCreate = function(activity) {
    "use strict";
    
    shortToast("🌈 RGB Pixel Text loaded!");
    
    var hue = 0;
    var targetInput = null;
    
    function updateColor() {
        if (targetInput != null && targetInput.getParent() != null) {
            hue = (hue + 10) % 360;
            var color = android.graphics.Color.HSVToColor([hue, 1.0, 1.0]);
            targetInput.setTextColor(color);
            targetInput.setTypeface(android.graphics.Typeface.MONOSPACE);
            targetInput.postDelayed(updateColor, 100);
        }
    }
    
    function findChatInput(view) {
        if (view instanceof android.widget.EditText) {
            var hint = view.getHint();
            if (hint != null && hint.toString().toLowerCase().includes("message")) {
                targetInput = view;
                updateColor();
                shortToast("✨ RGB effect applied!");
                return true;
            }
        } else if (view instanceof android.view.ViewGroup) {
            for (var i = 0; i < view.getChildCount(); i++) {
                if (findChatInput(view.getChildAt(i))) return true;
            }
        }
        return false;
    }
    
    setTimeout(function() {
        var decorView = activity.getWindow().getDecorView();
        findChatInput(decorView);
    }, 2000);
};

module.onUnload = function() {
    shortToast("🌈 RGB Pixel Text unloaded!");
};