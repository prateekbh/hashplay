riot.tag('hp-settings', '<hp-card><div class="header"> Change your hashtag </div><div class="body"><div class="text"> Set your new hashtag </div><div class="input"><input class="hashtag"></input></div></div><div class="action-panel"><button class="submit" onclick="{saveHashtag}">Save</button></div></hp-card>', function(opts) {
        this.saveHashtag=function(){
            var hashValue=this.root.querySelector(".hashtag").value||'';
            localStorage.setItem("hashTag",hashValue);
        }
    
});