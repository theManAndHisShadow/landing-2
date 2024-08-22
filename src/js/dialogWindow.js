class DialogWindow {

    /**
     * 
     * @param {Object} param.page
     */
    constructor({ page }) {
        this.page = page;
    }

    /**
     * 
     * @param {String} param.title - заголовок диалогового окна
     * @param {String} param.content - содержимое окна
     * @param {Boolean} param.isForm - является ли окно формой
     * @param {String} param.id - айди формы
     * @param {String} param.actionURL
     * @param {String} param.method - метод
     */
    createDialogWindow({ title, content, isForm, actionURL, method, id }) {
        let dark_layer = document.createElement('div');
        dark_layer.classList.add('dark-layer');

        let dialogWindow = document.createElement('div');
        dialogWindow.classList.add('dialog-window');

        let dialogWindowInner = document.createElement('div');

        if (isForm === true) {
            dialogWindowInner = document.createElement('form');
            dialogWindowInner.id = id;
            if (actionURL) dialogWindowInner.setAttribute('action', actionURL);
            if (method) dialogWindowInner.setAttribute('method', method);
        }

        dialogWindowInner.classList.add('dialog-window-inner');

        let windowTitle = document.createElement('div');
        windowTitle.innerHTML = title;
        windowTitle.classList.add('dialog-window-title');

        let windowContent = document.createElement('div');
        windowContent.innerHTML = content || 'empty';
        windowContent.classList.add('dialog-window-content');

        let windowCloseButton = document.createElement('div');
        windowCloseButton.classList.add('dialog-window-close-button');
        windowCloseButton.innerHTML = '<i class="fas fa-times"></i>';
        windowCloseButton.addEventListener('click', () => {
            this.closeDialogWindow();
        });

        dialogWindow.appendChild(dialogWindowInner);
        dialogWindowInner.appendChild(windowTitle);
        dialogWindowInner.appendChild(windowContent);
        dialogWindowInner.appendChild(windowCloseButton);

        if (document.getElementsByClassName('dark-layer').length == 0) {

            setCss(this.page, {
                animationDuration: '1.5s',
                filter: 'blur(10px)',
            });

            document.body.appendChild(dark_layer);

            setCss(dark_layer, {
                animationName: 'fade-in',
                animationDuration: '0.5s',
                opacity: '0.5',
            });
        }

        return dialogWindow;
    }

    showCustomerCallbackWindow(order) {
        let id = 'call_request';

        order = order || '';

        setCss(document.body, {
            marginRight: getScrollbarWidth() + 'px',
            overflow: 'hidden',
        });

        let requestWindow = this.createDialogWindow({
            title: 'Заказ обратного звонка',
            isForm: true,
            id: id,
            actionURL: '/send.php',
            method: 'POST',
            content: `
                <div>${order}</div>
                <div>Просто оставьте свои данные и мы перезвоним Вам <bold style="text-decoration: underline;font-weight: bold;">в ближайшее</bold> время!</div>

                <input type="text" name="name" placeholder="Как Вас зовут?" data-form-inputtype="name"/>
                <input type="text" name="number" placeholder="+7-000-000-00-00" data-form-inputtype="phone" required/>
                <input type="hidden" name="malfunction" data-form-inputtype="transport"/>

                <br/>
                <br/>

                <div class="gradient emerald button" data-form-buttontype="submit">Оставить заявку</div>

                <div class="pale-disclaimer">
                    <span>Нажимая "Оставить заявку", Вы принимаете</span>
                    <a style="" href="regulation.html" target="_blank" rel="nofollow">Положение</a>
                    и
                    <a style="" href="consent.html" target="_blank" rel="nofollow">Согласие</a> 
                    <span>на обработку персональных данных.</span>
                </div>
            `,
        });

        document.body.appendChild(requestWindow);

        formValidate(document.getElementById('call_request'), function () {
            document.getElementById('call_request').submit();
        });

        let windowBody = requestWindow.children[0];

        setCss(windowBody, {
            transform: 'scale(1)',
            animationName: 'scale-in-center',
            animationDuration: '0.5s',
        });

    }

    /**
     * 
     * @param {Object} targetRef ССылка на кнопку
     */
    closeDialogWindow() {
        let windowWrapper = document.getElementsByClassName('dialog-window')[0];
        let dark_layer = document.getElementsByClassName('dark-layer')[0];

        if (windowWrapper) {
            setCss(windowWrapper.children[0], {
                transform: 'scale(0)',
                animationName: 'scale-out-center',
                animationDuration: '0.25s',
            });

            setCss(this.page, {
                animationName: 'fade-out-blur',
                animationDuration: '1.5s',
                filter: 'blur(0px)',
            });

            setCss(dark_layer, {
                animationName: 'fade-out',
                animationDuration: '0.45s',
                opacity: '0',
            });

            setTimeout(() => {
                windowWrapper.remove();

                dark_layer.remove();
                setCss(document.body, {
                    marginRight: '0px',
                    overflow: 'inherit',
                });
            }, 500);
        }
    }
}