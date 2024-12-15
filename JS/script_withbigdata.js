$('#map').height(window.innerHeight);
// $('#slide-in').height(window.innerHeight);



$(document).on('click', '.leaflet-interactive', function() { // при клике на здание всплывает окно!
	if($('#slide-in').hasClass('in')){
		// $('#slide-in').removeClass('in')
		
	}else {
		$('#slide-in').addClass('in')
	}
})

// добавляем крестик для закрытия 
// $(() => {
//   $ ('#slide-in').each(function(){
//    let closeTrigger = $(this).find('.close-block').length;
//    if (closeTrigger < 1 ){ // проверяем наличие кнопки и если нет - добавляем
//     $(this).append('<span class="close-block"></span>');
//    }else{
//     return '';
//    }
//    $('.close-block').on('click', function(){
//     $(this).closest('#slide-in').fadeOut(100);
//    });
//   });
// });





let myMap = L.map('map').setView([57.160, 65.540], 14);

var CartoDB_Positron = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
	subdomains: 'abcd',
	maxZoom: 19
}).addTo(myMap)

function getColor(d) {
	return d > 1991 ? '#137EA9' :
				 d > 1917  ? '#C94034' :
				 d > 0  ? '#FFFF00' :
										'#918F90';
}

const buildingsJSON_URL = './json/tyumen__join_ALL.geojson'
let buildingsJSON = false
let min = 0
let max = 0
let filters = {}
fetch(buildingsJSON_URL, {
	method: 'GET'
})
.then(response =>{
	return response.json()
})
.then(json => {
	json.features.forEach(feature=> {
		$('#info').append(`<option value="${feature.properties.r_name}">${feature.properties.r_name}</option>`)
	})
	console.log(json)
	buildingsJSON = L.geoJSON(json, {
		style: (feature) => {
			return {
				fillColor: getColor(feature.properties.r_year_int),
				weight: 0,
				opacity: 1,
				color: 'white',
				dashArray: '3',
				fillOpacity: 0.7
			}
		},
		onEachFeature: (feature, layer) => {

			// get max and min 
			if (feature.properties.r_year_int < min || min ===0) {
				min = feature.properties.r_year_int
			}
			if (feature.properties.r_year_int > max) {
				max = feature.properties.r_year_int
			}
			
			layer.on('click', ()=> {

				// name
				if (layer.feature.properties.r_name) {
					$('#building-name').html(`${layer.feature.properties.r_name}`)
				}else {
						$('#building-name').html(` `)
				}
				// else if (layer.feature.properties.name_1) {
				// 	$('#building-name').html(`${layer.feature.properties.name_1}`)
				// }else {
				// 	$('#building-name').html(` `)
				// }
			
				// photo
				if (feature.properties.r_photo_url) {
					$('#building-photo').html(`<img style="width: 330px" src='${feature.properties.r_photo_url}'/>`)
				}
				else {
					$('#building-photo').html(`<img style='width: 200px'; style ="text-align: center;" src='https://brilliant24.ru/files/cat/template_01.png'/>`)
				}

				// YEAR
				if (layer.feature.properties.r_years_str) {
					$('#building-year').html(`Год постройки: ${layer.feature.properties.r_years_str}`)
				}else if (layer.feature.properties.r_year_int) {
					$('#building-year').html(`Год постройки: ${layer.feature.properties.r_year_int}`)
				}else {
					$('#building-year').html(` `)
				}

				// // style
				// if (layer.feature.properties.style) {
				// 	$('#building-style').html(`Стиль: ${layer.feature.properties.style}`)
				// }else {
				// 	$('#building-style').html(`Стиль: `)
				// }

				// // architector
				// if (layer.feature.properties.arch) {
				// 	$('#building-arch').html(`Архитектор: ${layer.feature.properties.arch}`)
				// }else {
				// 	$('#building-arch').html(`Архитектор: `)
				// }

				// address
				if (layer.feature.properties.r_adress) {
					$('#building-addr').html(`Адрес: ${layer.feature.properties.r_adress}`)
				}
				// }else if (layer.feature.properties.long_addr) {
				// 	$('#building-addr').html(`Адрес: ${layer.feature.properties.long_addr}`)
				// }else {
				// 	$('#building-addr').html(`Адрес: `)
				// }

				// wikipedia
				if (layer.feature.properties.r_wikipedia) {
					$('#building-wiki').html(`<a href="${layer.feature.properties.r_wikipedia}"> Википедия </a>`)
				}else {
					$('#building-wiki').html(` `)
				}

				// url
				if (layer.feature.properties.r_url) {
					$('#building-url').html(`<a href="${layer.feature.properties.r_url}"> Больше информации </a>`)
					
				}else {
					$('#building-url').html(` `)
				}

			})


			// pop Up
			// let photo 
			// if (feature.properties.photo_url){
			// 	photo = `<img style='width: 500px' src='${feature.properties.photo_url}'/>`
			// }else {
			// 	photo = `<img style='width: 200px; ' src='https://brilliant24.ru/files/cat/template_01.png'/>`
			// }
			// let buildingPopup = ''
			// let arrayOfProps = ['name','name_1','long_addr','short_addr', 'year_int','year_text','style','architec','wikipedia','url','where']
			// arrayOfProps.forEach(prop => {
			// 	buildingPopup += `</br> <strong>${prop} :</strong> ${feature.properties[prop]} </br>`
				 
			// })
			// layer.bindPopup(photo+buildingPopup)
		}

	}).addTo(myMap)

		// S L I D E R -------------------------------

		// <div id="slider"></div>
		filters.range = [min,max] // str 280

		let slider = document.getElementById('slider');

		noUiSlider.create(slider, {
				start: [filters.range[0], filters.range[1]], // установили границы где будут ручки слайдера
				connect: true,
				tooltips: true, // подписывание значений
				range: {
						'min': min,
						'max': max
				}
		}).on('slide', e=> {
			// console.log(e)  // ивент слайд срабатывает при движении слайдером. в консоли здесь выводятся занчения е - это мах и мин значения активных сейчас границ
			filters.range = [parseFloat(e[0]), parseFloat(e[1])] // parseFloat() - парсит текстовые данные в десятичные. тк к нам на выходе идут данные текстом
			buildingsJSON.eachLayer(layer => {  // eachLayer  дркржи в голове
			// console.log(e)
			if (layer.feature.properties.r_year_int >= filters.range[0] && layer.feature.properties.r_year_int <= filters.range[1]) {
				layer.addTo(myMap)
			}else {
				myMap.removeLayer(layer)
			}
				// filterGeoJSON(layer)
///////
				// if(layer.feature.properties.mag>=parseFloat(e[0]) && layer.feature.properties.mag<=parseFloat(e[1])){ // e[0] - текущий min на ползунке, e[1] - текущий max
				// 	layer.addTo(myMap)
				// }else{
				// 	myMap.removeLayer(layer)
				// }
///////
				
			})

		})
})
.catch(err=> {
	console.log('errorr'+err)
})

 // ничего не делает: 
$(document).on('change', '#info', function(e) {
	let building = e.target.value
	if(building !=='') {
		buildingsJSON.eachLayer(layer => {
			if(layer.feature.properties.r_name ==e.target.value){
				$('#building-info').html(`${layer.feature.properties.r_name}, year: ${layer.feature.properties.r_year_int}`
			)}
		})
	}else{
		$('building-info').html

	}
	console.log(building)
})





// feature.forEach(feature => {
			// 	$('#info').append(`<option>${feature.properties.name}</option>`)
			// })
			// $(document).on('click', '.leaflet-interactive', function(e) {
			// 	console.log(e.target.value)
			// console.log (feature.properties.name)
			// $('#info').html(feature.properties.name)

			// })



// $(document).on('click', '.leaflet-interactive', function(e) { // при клике на здание всплывает окно!
// 	let buildingSelected = e.target.value

// if (buildingSelected!=='') {
// 	buildingsJSON.eachLayer(layer => {
// 		console.log(e)
// 		$('#building-info').html(layer.feature.properties.name)
// 		console.log('f')
// 	})
// }else{
// 	console.log('ddfsdfsgfgadf')
// }

// $('#building-info').html(e.target.value)

// })





// L E G E N D -------------

// let legend = L.control({
// 	position: 'bottomleft'
// })

// legend.onAdd = map => {
// 	let div = L.DomUtil.create('div', 'info-legend')
// 	let grades = [1980, 1990, 2010, 2020]
// }
// buildingsJSON.bindPopup('f')