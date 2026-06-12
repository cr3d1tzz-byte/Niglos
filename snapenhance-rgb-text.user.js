// ==UserScript==
// @name         SnapEnhance RGB Pixel Text
// @namespace    https://github.com/YOUR_USERNAME/snapenhance-rgb-text
// @description  Makes your Snapchat chat text RGB with a pixelated effect for SnapEnhance Web
// @version      1.0.0
// @author       YOUR_USERNAME
// @match        *://snapchat.com/web/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=snapchat.com
// @grant        unsafeWindow
// @run-at       document-start
// @license      MIT
// @source       https://github.com/YOUR_USERNAME/snapenhance-rgb-text
// @supportURL   https://github.com/YOUR_USERNAME/snapenhance-rgb-text/issues
// @updateURL    https://raw.githubusercontent.com/YOUR_USERNAME/snapenhance-rgb-text/main/snapenhance-rgb-text.user.js
// @downloadURL  https://raw.githubusercontent.com/YOUR_USERNAME/snapenhance-rgb-text/main/snapenhance-rgb-text.user.js
// ==/UserScript==

(function (window) {
    'use strict';
    
    let rgbInterval = null;
    let currentChatInput = null;
    
    function showNotification(message) {
        try {
            const toastStyle = `
                position: fixed;
                bottom: 80px;
                left: 50%;
                transform: translateX(-50%);
                background: linear-gradient(45deg, #ff0000, #00ff00, #0000ff);
                color: white;
                padding: 10px 20px;
                border-radius: 8px;
                font-family: 'Courier New', monospace;
                font-size: 14px;
                font-weight: bold;
                z-index: 999999;
                animation: fadeInOut 2s ease;
                pointer-events: none;
                white-space: nowrap;
            `;
            
            const toast = document.createElement('div');
            toast.style.cssText = toastStyle;
            toast.textContent = message;
            document.body.appendChild(toast);
            setTimeout(() => toast.remove(), 2000);
        } catch(e) {
            console.log('[RGB Text]', message);
        }
    }
    
    const addStyles = () => {
        if (document.getElementById('rgb-styles')) return;
        const style = document.createElement('style');
        style.id = 'rgb-styles';
        style.textContent = `
            @keyframes fadeInOut {
                0% { opacity: 0; transform: translateX(-50%) translateY(20px); }
                15% { opacity: 1; transform: translateX(-50%) translateY(0); }
                85% { opacity: 1; transform: translateX(-50%) translateY(0); }
                100% { opacity: 0; transform: translateX(-50%) translateY(-20px); }
            }
        `;
        document.head.appendChild(style);
    };
    
    function applyRgbEffect(inputElement) {
        if (!inputElement || inputElement !== currentChatInput) {
            if (rgbInterval) {
                clearInterval(rgbInterval);
                rgbInterval = null;
            }
            currentChatInput = inputElement;
        }
        
        if (inputElement && !rgbInterval) {
            console.log('[RGB Text] Applying RGB effect');
            showNotification('🌈 RGB Pixel Text ACTIVE!');
            
            let hue = 0;
            rgbInterval = setInterval(() => {
                if (inputElement && document.body.contains(inputElement)) {
                    hue = (hue + 10) % 360;
                    inputElement.style.color = `hsl(${hue}, 100%, 55%)`;
                    inputElement.style.fontFamily = "'Courier New', monospace";
                    inputElement.style.fontWeight = 'bold';
                    inputElement.style.textShadow = '0 0 2px rgba(0,0,0,0.5)';
                } else {
                    clearInterval(rgbInterval);
                    rgbInterval = null;
                    currentChatInput = null;
                }
            }, 80);
        }
    }
    
    function findAndApplyToChatInput() {
        const selectors = [
            '[contenteditable="true"]',
            '[contenteditable="plaintext-only"]',
            'div[role="textbox"]',
            '[data-testid="chat-text-input"]'
        ];
        
        for (const selector of selectors) {
            const input = document.querySelector(selector);
            if (input && input.isContentEditable !== false) {
                applyRgbEffect(input);
                return true;
            }
        }
        return false;
    }
    
    function init() {
        addStyles();
        showNotification('🚀 RGB Pixel Text Loaded');
        
        setTimeout(() => findAndApplyToChatInput(), 1000);
        
        const findInterval = setInterval(() => {
            if (findAndApplyToChatInput()) {
                setTimeout(() => clearInterval(findInterval), 5000);
            }
        }, 500);
        
        const observer = new MutationObserver(() => {
            const inputs = document.querySelectorAll('[contenteditable="true"]');
            inputs.forEach(input => {
                if (input !== currentChatInput) applyRgbEffect(input);
            });
        });
        observer.observe(document.body, { childList: true, subtree: true });
        
        document.addEventListener('focusin', (e) => {
            if (e.target && e.target.isContentEditable) applyRgbEffect(e.target);
        });
    }
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
})(window.unsafeWindow || window);