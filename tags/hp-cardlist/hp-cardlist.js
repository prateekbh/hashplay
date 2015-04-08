riot.tag('hp-cardlist', '<hp-card each="{card, index in cards}" class="card-{index}" riot-style="-webkit-animation-delay:{(index+1)*50}ms" title="How u doin???" model="{card}"></hp-card>', function(opts) {
        this.cards=window.response;
    
});
