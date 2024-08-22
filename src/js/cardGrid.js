class CardGrid{

    /**
     * 
     * @param {Object} param.container
     * @param {String} param.title
     * @param {Array} param.content
     * @param {Object} param.itemSize
     * @param {Number} param.itemSize.width
     * @param {Number} param.itemSize.height
     * @param {Function} param.itemOnClickAction
     */
    constructor({title, container, content, itemSize, itemOnClickAction, parent}){
        this.parent = parent;
        this.container = container;

        this.title = title;
        this.content = content;

        this.itemSize = itemSize;

        this.itemOnClickAction = itemOnClickAction;
    }


    injectCSSRule(){
        let classList = 'card-grid-custom-stylesheet';
        
        if(document.getElementsByClassName(classList).length ==0) {
            let style = document.createElement('style');
            style.classList.add(classList);

            style.innerHTML = 
`
.card-grid-ul .card-grid-card .card-header-image::before,
.card-grid-ul .card-grid-card .card-header-image::after{
    height: ${this.itemSize.height}px;
}

.card-header-image{
    height: ${this.itemSize.height}px;
}

.card-grid-ul .card-grid-card{
    width: ${this.itemSize.width}px;
}
`

            if(this.description == undefined) style.innerHTML += `.card-grid-ul .card-grid-card{height: ${this.itemSize.height}px;}` 

            document.body.appendChild(style);
        }
    }


    create(){
        this.injectCSSRule();

        let array = this.content;
        let ul = document.createElement('ul');
        
        ul.classList.add('card-grid-ul')

        this.container.innerHTML = 
`
<div class="section-name">
    <p class="subtitle hr"><span class="subtitle-h2">${this.title}</span></p>
</div>
`

        for(let i = 0; i < array.length; i++){
            let item = array[i], card = document.createElement('li');
            let self = this;

            card.classList.add('card-grid-card');

            card.addEventListener('click', function(){
                self.itemOnClickAction(i);
            });
            card.innerHTML += 
`
<div class="card-header">
    <div class="card-header-image" style="background-image: url(${item.imageURL})"></div>
    <h3 class="card-header-title"><center>${item.title}</center></h3>
</div>
`;          

            ul.appendChild(card);

            let description = ul.children[ul.children.length - 1];
            if(item.description !== undefined) description.innerHTML += `<br><div class="description">${item.description}</div>`;
        }

        this.container.appendChild(ul);
    }
}