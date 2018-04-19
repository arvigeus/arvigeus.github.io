if (!navigator.clipboard) navigator.clipboard = {
    writeText: function(text) {
        var textArea = document.createElement('textArea');
        textArea.style.opacity = 0;
        textArea.value = text;
        document.body.appendChild(textArea);

        if (navigator.userAgent.match(/ipad|iphone/i)) {
            var range = document.createRange();
            range.selectNodeContents(textArea);
            selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(range);
            textArea.setSelectionRange(0, 999999);
        }
        else textArea.select();

        document.execCommand('cut');
        document.body.removeChild(textArea);
    }
}