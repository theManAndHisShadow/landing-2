class Slider{
    /**
     * 
     * @param {Object} param.container - родительский элемент, который будет содержать контент
     * @param {Array}  param.content - массив содержимого
     * @param {Function} param.construct - функция-генератор для работы с каждым элементом массива content. Данная функция должна возвращать String
     * @param {Boolean} param.shuffle - требуется ли перемешивание содержимого массива
     * @param {Number} param.speed - скорость анимации
     */
    constructor({container, content, construct, shuffle, speed, gutter, style}){
        this.container = container;
        this.content = content;

        this.speed = speed;
        this.shuffle = shuffle;

        this.gutter = gutter;
        
        if(style){
            this.style = {
                width: style.width,
                heigh: style.height,
                gutter: style.gutter,
            };
        }

        this.construct = construct;

        return this;
    }


    /**
     * Функция динамического создания стилей для анимации карусели 
     * @param {Number} length - длина карусели
     * @param {Number} elementWidth - ширина одного элемента, необходима для расчёта ширины родтелского элемента и создания бесшовной анимации
     */
    injectCSSRule(item){

        let style_sheet = document.createElement('style');
        let amount = this.content.length;
        let padding = parseInt(window.getComputedStyle(item, null).paddingLeft);
        let fullWidth = this.style.width + (this.style.gutter * 2) + (padding*2);

        style_sheet.classList.add('slider--style-sheet');
        style_sheet.innerHTML = 
`
@keyframes scroll {
    0% {
        transform: translateX(0);
    }
    100% {
        transform: translateX(-${fullWidth * amount}px);
    }
}

.infinity-carousel .carousel-track {
    animation: scroll ${this.speed/1000}s linear infinite;
    display: flex;
    width: ${fullWidth * amount}px;
}

.carousel-item {
    width: ${this.style.width}px;
    margin: 0px ${this.style.gutter}px;
  }
`;

        if(item.children.length > 0 && item.getElementsByTagName('img')[0]){
            style_sheet.innerHTML += 
`
.carousel-item img{
    width: ${this.style.width}px;
  }
`
        }

        document.body.appendChild(style_sheet);
    }


    // Метол создаёт список элементов, каждый из которых содержит по элементу из массива content
    create(){

        function addToHTML(self, to){
            for(let i = 0; i < self.content.length; i++){
                to.innerHTML +=  
                    `<div class="carousel-item">
                        <div class="carousel-item--table-cell">
                            ${self.construct(self.content[i])}
                        </div>
                    </div>`
            }
        }

        let array = this.shuffle === true ? shuffleArray(this.content) : this.content;
        let wrapper = document.createElement('div');
        let track = document.createElement('div');
        let track_mobileVersion = document.createElement('div');

        wrapper.classList.add('infinity-carousel');
        track.classList.add('carousel-track');
        track_mobileVersion.classList.add('carousel-track--mobile');

        // не баг, для бесшовной анимации требуется дублирование списка
        addToHTML(this, track);
        addToHTML(this, track);

        addToHTML(this, track_mobileVersion);

        wrapper.appendChild(track);
        wrapper.appendChild(track_mobileVersion);
        this.container.appendChild(wrapper);

        this.injectCSSRule(document.getElementsByClassName('carousel-item')[0]);

    }
    

}