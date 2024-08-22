class Order{

    /**
     * 
     * @param {Array} param.pricelist
     * @param {Object} param.container
     * @param {String} param.title
     * @param {Function} param.action
     */
    constructor({container, pricelist, title, id, action}){
        this.container = container;

        this.title = title;

        this.pricelist = pricelist;
        this.checkboxes = document.getElementsByClassName('service');
        
        // Было ли взаимодействие с формой
        this.clicked  = false;

        this.order = {
           
        };

        this.action = action;

        this.serviceStates = [];

        return this;
    }



    // Создать таблицу с прайслистом и формой заказа
    create() {
        let self = this;
        // Локальные вспомогательные функции

        // Для ячейки
        function isAttributesCell(cell){
            return /attributes:/gm.test(cell)? true : false;
        }

        // Для строки
        function rowHasAttributeCell(row){
            return row.filter(row => {
                return /attributes:/.test(row) == true;
            }).length > 0 ? true : false;
        }

        // Создаём элементы
        let HTMLtable = document.createElement('table');
        let tableBody = document.createElement('tbody');

        HTMLtable.id = "pricelist";
        HTMLtable.classList.add('site-section');


        // Отрисовка таблицы
        for(let i = 0; i < this.pricelist.table.length; i++){
            if(i !== 0) this.serviceStates.push(0); // Если не первася строка - не заголовок!

            let row = this.pricelist.table[i], 
                columns = '', attributes = '';

                for(let j = 0; j < row.length; j++){

                    let column = row[j];
                    
                    if(j == 0 && isAttributesCell(column) == false) column = 
`<input 
    type="checkbox" 
    title="Кликните, если хотите добавить услугу в заявку на вызов мастера" 
    class="service"> ${column}`;

                    // Если строка содержит ячейку с атрибутом, то сдвинуть указатель чейки с ценой
                    let n = rowHasAttributeCell(row) === true ? this.pricelist.priceColumn + 1 : this.pricelist.priceColumn;

                    // Сходится ли указатель ячейки с ценой с номером текущей ячейки
                    let isItPrice = j == n;
                    
                    // Если это ячейка с ценой и не первая строка (загловки), то использовать перфикс и постфик цены (от ЦЕНА р.)
                    let content = isItPrice === true  && i !== 0 ? this.pricelist.pricePrefix + column + this.pricelist.pricePostfix : column;

                    // Если эта ячейка не аттрибут, то "отрисовать"
                    if(!isAttributesCell(column)) columns += `<td ${j == n ? 'class="price"' : ''}>${content}</td>`;

                    // Иначе извлечь атрибуты
                    if(isAttributesCell(column)) attributes = column[0].split(':')[1];
                }

            // "отрисовываем всё остальное"
            tableBody.innerHTML +=  `
                                    <tr ${attributes} >
                                        ${columns}
                                    </tr>
                                    `;


        }
        // конец отрисовки таблицы

        // Вставляем в DOM дерево
        HTMLtable.appendChild(tableBody);
        
        this.container.innerHTML += this.title;
        this.container.appendChild(HTMLtable);

        let checkboxes = this.checkboxes;
        
        for(let k = 0; k < checkboxes.length; k++){
            let checkbox = checkboxes[k];
            let self = this;

            checkbox.parentNode.addEventListener('click', function(){
                self.clicked = true;
                let c = self.isAlreadySelected(k);

                c == false ? self.selectService(k) : self.deselectService(k);
            });
        };

        let order_info = document.createElement('div');
        order_info.id = "order_info";
        order_info.innerHTML = 
`
<div id="order_list">
    <div class="none-active">
        <h2>Ваш заказ</h2>

        <br> 

        <ul class="order-list">
            <em>(Вы ещё не выбрали ни одну услугу)</em>
        </ul>

        <br>

        <h2 id="total_price">Итого: 0 рублей</h2>
        
        <button id="order_button" class="gradient indigo medium-font default-hidden">Оформить заказ</button>
        <button id="cancel_button" class="gradient medium-font default-hidden pale">Отменить заказ</button>
    </div>
</div>
`;

        this.container.appendChild(order_info);

        this.order.body = document.getElementById('order_list');
        this.order.list = document.getElementsByClassName('order-list')[0];
        this.order.order_btn = document.getElementById('order_button');
        this.order.cancel_btn = document.getElementById('cancel_button');
        this.order.totalPrice = document.getElementById('total_price');

        this.order.cancel_btn.addEventListener('click', function(){
            self.deselectAllServices();
        });

        this.order.order_btn.addEventListener('click', function(){
            self.action();
        });
    }



    // Обновить текущий заказ
    refreshCurrentOrder(){
 
        function addVisualMark(self, i){
            self.checkboxes[i].checked = true;
        }

        function removeVusialMark(self, i){
            self.checkboxes[i].checked = false;
        }


        let array = this.serviceStates;
        let summ = 0, oldTotalPrice = 0;

        if(array.indexOf(1) !== -1){
            this.order.body.children[0].classList.remove('none-active');

            setCss(this.order.order_btn, {
                animationName: `expand-bounce`,
                animationDuration: `1s`,
                transform: 'scale(1)',
            });

            setCss(this.order.cancel_btn, {
                animationName: `expand-bounce`,
                animationDuration: `1s`,
                transform: 'scale(1)',
            });

        } else {
            this.order.body.children[0].classList.add('none-active');

            if(this.clicked == true){
                setCss(this.order.order_btn, {
                    animationName: `shrink-bounce`,
                    animationDuration: `1s`,
                    transform: 'scale(0)',
                });
    
                setCss(this.order.cancel_btn, {
                    animationName: `shrink-bounce`,
                    animationDuration: `1s`,
                    transform: 'scale(0)',
                });
            }
        }

        this.order.list.innerHTML = "";

        for(let i = 0; i < array.length; i++){

            let index = array[i];
            let service = this.pricelist.table[i+1][0][0];
            let price = this.pricelist.table[i+1][1][0];


            index == 1 ? addVisualMark(this, i) : removeVusialMark(this, i);
            
            if(index == 1){
                summ += price; 
                this.order.list.innerHTML += "<li>"+ service +"</li>";
            }
        }

        if (this.serviceStates.indexOf(1) == -1){
            this.order.list.innerHTML += "<em>(Вы ещё не выбрали ни одну услугу)</em>";
        }
        
        this.order.totalPrice.innerHTML = summ;

        const countUp = new CountUp('total_price', 0, {
            startVal: oldTotalPrice,
            duration: 0.25,
            separator: ' ',
            prefix: 'Итого: ',
            suffix: ' рублей',
        });
        
        oldTotalPrice = summ;

        countUp.start();
        countUp.update(summ);
    }


    // Проверка услуги на то, является ли она выбранной
    isAlreadySelected(index){
        return this.serviceStates[index] == 1 ? true : false;
    }



    // Отменить выбор всех услуг
    deselectAllServices(){
        let a = '0'.repeat(this.serviceStates.length);
        this.serviceStates = Array.from(a, elem => parseInt(elem));

        this.refreshCurrentOrder();
    }


    // Выбрать услугу
    selectService(index){
        this.serviceStates[index] = 1;

        this.refreshCurrentOrder();
    }



    // Отменить выбор услуги
    deselectService(index){
        this.serviceStates[index] = 0;

        this.refreshCurrentOrder();
    }

}