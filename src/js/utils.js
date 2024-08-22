/**
 * Смешивает содержимое массива
 * @param {Array} array массив, данные которого нужно перемешать
 */
function shuffleArray(array) {
    let currentIndex = array.length, temporaryValue, randomIndex;
  
    // Пока есть что смешивать - смешивать
    while (0 !== currentIndex) {
  
      // Выбрать случайный индекс
      randomIndex = Math.floor(Math.random() * currentIndex);
      
      // обновить текущий индекс
      currentIndex -= 1;
  
      // Смешиваем чатси массива таким вот трюком
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
  
    return array;
}

// Получить ширину скроллбара
function getScrollbarWidth() {
	return window.innerWidth - document.documentElement.clientWidth;
}


/**
 * Проводит валидацию формы
 * @param {Object} inputRef - ссылка на поле ввода, значения котрого нужно проверить
 */
function formValidate(formRef, action){
    const FormErrors = {
        counter: 0,

        phone: {
            errorMessage: null,
            showOnElement: formRef.querySelectorAll("input[data-form-inputtype='phone']")[0],
        },

        name: {
            errorMessage: null,
            showOnElement: formRef.querySelectorAll("input[data-form-inputtype='name']")[0],
        },

        submit: {
            errorMessage: null,
            body: formRef.querySelectorAll('div[data-form-buttontype="submit"]')[0],
        },


        /**
         * Добавляет новую ошибку
         * @param {String} type - тип ошибки
         * @param {String} errorMsg - сообщение ошибки
         */
        addError: function(type, errorMsg){
            let target = FormErrors[type].showOnElement;
            let msg = createErrorMsg(errorMsg, type);

            target.parentNode.insertBefore(msg, target);

            this[type].errorMessage = msg;
            this.counter++;

            console.log(FormErrors);
        },

        /**
         * Проверяет наличие ошибок
         * @param {String} type - тип ошибки
         */
        isErrorExist: function(type){
            return formRef.querySelectorAll('div[data-form-errortype='+ type +']').length > 0 ? true : false;
        },

        removeError: function(type){
            this[type].errorMessage.remove();

            this.counter--;

            console.log(FormErrors);
        },
    };
    
    // Главная кнопка заказа
    const order_button = formRef.querySelectorAll('div[data-form-buttontype="submit"]')[0];

    // Ограничение по длине
    const lengthLimit = 12;


    /**
     * Создает сообщение об ошибке
     * @param {String} text - текст сообщения
     * @param {String} errorType - тип ошибки
     */
    function createErrorMsg(text, errorType){
        let element = document.createElement('div');
            element.innerHTML = text;
            element.classList.add('dialog-window-error');
            element.setAttribute('data-form-errortype', errorType)

        return element;
    }


    function validateName(){
        return /[^а-яёА-яЁ]/gm.test(FormErrors.name.showOnElement.value);
    }


    /**
     * Удаляет последний символ
     * @param {Object} ref - ссылка на элемент
     * @param {Boolean} protectFirtsLetter - защита первого элемента от удаления
     */
    function deleteLastSymbol(ref, protectFirtsLetter){
        let a = protectFirtsLetter == true ? 1 : 0;
        if(ref.value.length > a) {
            ref.value = ref.value.substring(0, ref.value.length - 1);
        }
    }


    FormErrors.phone.showOnElement.addEventListener('click', function(){
        if(this.value.length < 2) this.value = '+7';
    });

    // Элемент-поле для ввода номера
    FormErrors.phone.showOnElement.addEventListener('input', function(event){

        if(this.value.length <= lengthLimit && FormErrors.isErrorExist('phone')) FormErrors.removeError('phone');

        if(this.value.length < 2) this.value = '+7';
        // Сразу удаляем не цифры
        this.value = this.value.replace(/[^0-9+]/gm, '').replace(/\+{1,}/gm, '+');

       if(!/^([\+]{1}|8)[0-9]+$/g.test(this.value)){
           deleteLastSymbol(this, true);
       }

       // Проверям лимит
       if(this.value.length > lengthLimit) {
           // При превышении - удаляем лишние символы
           deleteLastSymbol(this, true);
        }  

    });


    FormErrors.name.showOnElement.addEventListener('input', function(event){
        if(validateName()) {
            if(FormErrors.isErrorExist('name') == false){
                FormErrors.addError('name', 'Только кириллица!');
            }
        } else {
            if(FormErrors.isErrorExist('name')) FormErrors.removeError('name');
        }

        // Сразу удаляем все символы, кроме буквенных символов
        this.value =  this.value.replace(/[^а-яёА-яЁ|+]/gm, '');

        if(this.value.length > 26) this.value = this.value.substring(0, 26);
    });


    order_button.addEventListener('click', function(){
        if(FormErrors.phone.showOnElement.value.length == 0 || (FormErrors.phone.showOnElement.value.length < lengthLimit && FormErrors.isErrorExist('phone') == false)){
            FormErrors.phone.showOnElement.click();
            
            let word_array = ['цифру', 'цифры', 'цифр'],
                d = lengthLimit - FormErrors.phone.showOnElement.value.length,
                word = d < 2 ? word_array[0] : d < 5 ? word_array[1] : word_array[2];

            FormErrors.addError('phone', 'Вы забыли дописать '+ d + ' ' + word + '!');
        }

        if(FormErrors.counter == 0){
            action();
        }
    });


}

/**
 * Обновляет css значение у заданного  элемента, может изменять сразу несколько свойств за раз
 * @param {Object} target - modifiactions target
 * @param {Object} changes - CSS props and new vals
 */
function setCss(target, changes){
    if(target){
        let keys = Object.keys(changes);
        let vals = Object.values(changes);

        for (let i = 0; i < keys.length; i++) {
            let key = keys[i], val = vals[i];
            
            target.style[key] = vals[i];
        }
    }
}