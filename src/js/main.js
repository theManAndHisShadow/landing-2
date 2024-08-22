(function() {
	const page = {
			body: document.getElementById('page'),

			requestWindowIs: false,

			services: [
				{ title: "Диагностика", price: 0 }, 														// 0
				{ title: "Ремонт/замена антенного гнезда", price: 500 }, 									// 1
				{ title: "Ремонт/замена системной платы", price: 700 }, 									// 2
				{ title: "Ремонт/замена блока питания", price: 700 }, 										// 3
				{ title: "Ремонт/замена разъёма питания", price: 700 }, 									// 4
				{ title: "Ремонт/замена динамиков", price: 750 }, 											// 5
				{ title: "Ремонт/замена мультимедийного разъёма (HMDI, LAN, USB)", price: 750 }, 			// 6
				{ title: "Ремонт/замена инвертора", price: 850 }, 											// 7
				{ title: "Ремонт/замена блока управления", price: 850 }, 									// 8
				{ title: "Перепрошивка системной платы", price: 900 }, 										// 9
				{ title: "Ремонт/замена элементов подсветки", price: 1000 }, 								// 10
			],

			malfunctions_list: [
				{
					title: "Телевизор не включается",
					servicesIds: [0, 4, 3, 8],
				},

				{
					title: "Нет изображения",
					servicesIds: [0, 7, 9, 10],
				},

				{
					title: "Нет звука",
					servicesIds: [0, 2, 5],
				}, 

				{
					title:"Отсутствует сигнал",
					servicesIds:[0, 2, 1],
				}, 

				{
					title: "Не видит устройства",
					servicesIds: [0, 7, 8],
				},

				{
					title: "Не переключает каналы",
					servicesIds: [0, 8, 9],
				},
			],

			malfunctions: new CardGrid({
				container: document.querySelector('#malfunctions'),
				title: 'С какой неисправностью Вы столкнулись?',

				itemSize: {
					height: 160,
					width: 320,
				},

				itemOnClickAction: function(i){
					page.windows.order_window.showCustomerCallbackWindow(page.order.createOrder(i));

                    if(document.querySelectorAll("input[data-form-inputtype='transport']")[0]){
                        document.querySelectorAll('input[data-form-inputtype="transport"]')[0].value = page.malfunctions_list[i].title;
                    }
				},

				content: [
					{
						title: 'Телевизор <br> не включается',
						imageURL: 'build/media/images/malfunctions/wi-fi-tv.jpg', 
					},

					{
						title: 'Нет изображения',
						imageURL: 'build/media/images/malfunctions/Picture25.png', 
					},

					{
						title: 'Нет звука',
						imageURL: 'build/media/images/malfunctions/audio.png', 
					},

					
					{
						title: 'Отсутствует сигнал',
						imageURL: 'build/media/images/malfunctions/IMG_2108_smallest.jpg', 
					},

					{
						title: 'Не видит устройства',
						imageURL: 'build/media/images/malfunctions/PN-K321-connectivity-ports-790x653.jpg', 
					},

					{
						title: 'Не переключает каналы',
						imageURL: 'build/media/images/malfunctions/firmware.png', 
					},
				],
			}),

			order: {
				createOrder: function(selectedServiceGroup){
					let ids = page.malfunctions_list[selectedServiceGroup].servicesIds;
					let list = page.services;
					let services = '';
					let total_price = [];

					ids.forEach(i =>{
						services += '<li>' + page.services[i].title + '</li>';
						total_price.push(page.services[i].price);
					});

					total_price = Math.max.apply(null, total_price);

					return `
							<div>
								<div>
									<div id="order_services_recommendation">Для решения вашей проблемы <br/> рекомендуется одна из следующих услуг: </div>
							
									<br> 
							
									<ul class="order-list">
										${services}
									</ul>
							
									<br>
							
									<p id="total_price">Примерная стоимость: ~ ${total_price} р.</p>
									
								</div>
							</div>
					`;
				},
			},

			windows: {
				order_window: new DialogWindow({
					page: this.page,
				}),
			},

			carousel: {
				body:  new Slider({
						container: document.querySelector("#brands_list"),
						content: ["bbk", "daewoo", "elenberg", "hyundai", "jvc", "lg", "panasonic", "philips", "pioneer", "samsung", "sharp", "sony", "thomson", "toshiba"],

						shuffle: true,
						speed: 30000,
						
						style: {
							width: 180,
							height: 100,
							gutter: 10,
						},

						construct: function(item){
							return `
								<img 
									src="build/media/images/brand-logos/${item}.png"
									alt="Не удалось загрузить изображение. Проверьте ваше подключение к интернету!"
									class="brand-logo"
								/>`;
						},
					}),
				
					create: function(){
						this.body.create();
					},
				},
			};

		const request_button = document.getElementById('request_button');
		const order_button = document.getElementById('order_button');
		const cancel_button = document.getElementById('cancel_button');


	/**
	 * 
	 * @param {Number} param.point - nриггер-точка, пересечение во время скролла которой запустет анимацию
	 * @param {Object} param.whenAppears - даём ссылку на элемент, визуальное повявление которого и должно запустить анимацию
	 * @param {Function} param.action - необходимое действие
	 * @param {Number} param.delay - задержка
	 */
	function animatePoint({point, whenAppears, action, delay}){
		point = point || 0;
		delay = delay || 0;

		let y = window.scrollY;

		if(whenAppears){
			edges = whenAppears.getBoundingClientRect();

			let animatePoint_line = document.createElement('div');
			animatePoint_line.id = 'animatePoint_line';
			animatePoint_line.style = `
				position: absolute;
				height: 1px;
				display: block;
				top: ${edges.top+200}px;
			`;

			if(document.getElementById('animatePoint_line') == undefined) document.body.appendChild(animatePoint_line);

			let scrollPosition_line = document.createElement('div');
			scrollPosition_line.id = 'scrollPosition_line';
			scrollPosition_line.style = `
				position: fixed;
				height: 1px;
				display: block;
				bottom: ${y+20}px;
			`;

			if(document.getElementById('scrollPosition_line') == undefined) document.body.appendChild(scrollPosition_line);

			if(document.getElementById('scrollPosition_line').getBoundingClientRect().bottom > document.getElementById('animatePoint_line').getBoundingClientRect().top){
				action();
				document.getElementById('animatePoint_line').remove();
				document.getElementById('scrollPosition_line').remove();
			}
		}


		if(point > 0 && y > point && delay == 0) {
			action();
		} else if(typeof delay == 'number' && delay > 0){
			setTimeout(function(){
				action();
			}, delay);
		}

	}

	/**
	 * 
	 * @param {Array} funcAimsArray - массив с идексами целей функции
	 * @param {Array} directions - массив с указанием направлений анмации
	 */
	function setUpBenefitSectionAnimation(funcAimsIndexesArray, directions){
		let delay = 350;

		for(let i = 0; i < funcAimsIndexesArray.length; i++){
			setTimeout(function(){
				setCss(document.querySelectorAll('.benefit')[i], {
					animation: 'slide-in-blurred-'+ directions[i] +' 0.5s cubic-bezier(0.230, 1.000, 0.320, 1.000) both',
					animationDuration: '1s',
					transform: 'scale(1)',
				});
			}, delay*i);
		}
	}

	document.getElementById('contacts').addEventListener('mouseover', function(){
		setCss(document.querySelector('#logo_baloon'), {
			animationName: 'expand-bounce',
			animationDuration: '1s',
			transform: 'scale(1)',
		});
	});

	setTimeout(function(){
		setUpBenefitSectionAnimation([0, 1, 2], ['left', 'top', 'right']);
	}, 500);
	
	document.addEventListener('scroll', function(){
		animatePoint({
			whenAppears: document.querySelector('#order_media'),
			action: function(){

				let infoAnim = document.querySelector('#order_info_baloon');
				setCss(infoAnim, {
					animationName: 'expand-bounce',
					animationDuration: '1s',
					transform: 'scale(1)',
				});
			},
		});	});

	page.malfunctions.create();

	let priceFix = document.getElementsByClassName('price')[1];
	priceFix.innerHTML = "Бесплатно, если Вы соглашаетесь на ремонт выявленной поломки, иначе - платно. </br>Пожалуйста, уточняйте цену у мастера.";
	priceFix.classList.add('small-text');

	request_button.addEventListener('click', function(){
		page.windows.order_window.showCustomerCallbackWindow();
	});
	
	page.carousel.create();

	console.log(page);
}());