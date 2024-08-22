// Настройки
let MINIFY_JS = false;

// Переменные
const gulp = require('gulp'),
	  browserSync = require('browser-sync').create(),
	  concat = require('gulp-concat'),
	  autoprefixer = require('gulp-autoprefixer'),
	  cleanCSS = require('gulp-clean-css'),
	  uglify = require('gulp-uglify-es').default,
	  del = require('del');


// Компиляция стилей
function css(){
	return gulp.src([
				'./src/css/slider.css', 
				'./src/css/cardGrid.css', 
				'./src/css/main.css'
			])

			// объединяем все указанные файлы в нужной последовательности
			// в @NAME@.css
		   .pipe(concat('common.css')) // @NAME@.css

		   // автоматически вставляем префиксы для css свойтсв
		   .pipe(autoprefixer({
			   	//  browsers: ['last 1 versions'],
	            cascade: false
		   }))

		   // Минификация css кода
		//     .pipe(cleanCSS({level: 2}))

		   // сохраняем в указанную папку
		   .pipe(gulp.dest('./build/css'))
		   .pipe(browserSync.stream());
}

// Компиляция скриптов
function js(){	

	return gulp.src([
				'./src/js/utils.js',
				'./src/js/countUp.min.js',
				'./src/js/dialogWindow.js',
				'./src/js/order_list.js',
				'./src/js/cardGrid.js',
				'./src/js/slider.js',
				'./src/js/main.js' 
			])

			// объединяем все указанные файлы в нужной последовательности
			// в @NAME@.js
		   .pipe(concat('common.js')) // @NAME@.js

		   // Минификация js кода
		   .pipe(uglify({
	   			mangle: {
	   				toplevel: true,
	   			}
	   		}))
		   // сохраняем в указанную папку
		   .pipe(gulp.dest('./build/js'))
		   .pipe(browserSync.stream());
}


// Очистка папки билд
function clean(){
	return del([
			'build/*', 

			// Исключения
			'!build/index.html',
			'!build/media', 
		]);
}

// Автообновление изменений
function watch(){
	browserSync.init({
        server: {
            baseDir: "./",
        }
    });

	// Следить за изменениями css файлов
    gulp.watch('./src/css/**/*.css', css);

    // Следить за именениеми js файлов
    gulp.watch('./src/js/**/*.js', js);

    // Следить за изменениями html файлов
    gulp.watch("./*.html").on('change', browserSync.reload);
}

/**
 * Управление процессами
 */

// Вызов тасков
gulp.task('styles', css);

gulp.task('scripts', js);

gulp.task('clean', clean);

// Отслеживание измененией и авторелоад
gulp.task('watch', watch)

// Главный таск
// Сначала очищает папку билд
// Далее в одно и то же время, приводит в нужный вид стили и скрипты
gulp.task('build', gulp.series(clean, gulp.parallel(css, js)));

// Пересборка папки билд и запуск сервера с авторелоадом
gulp.task('dev', gulp.series('build', 'watch'));