import webp from 'gulp-webp';
import imagemin from 'gulp-imagemin';

export const images = () => {
  return app.gulp.src(app.path.src.images, { encoding: false })
    .pipe(app.plugins.plumber(
        app.plugins.notify.onError({
          title: 'IMAGES',
          message: 'Error: <%= error.message %>',
        }))
    )
    .pipe(app.plugins.newer(app.path.build.images)) //прверка на обновления
    .pipe(app.plugins.if(app.isBuild,imagemin({
          progressive: true,
          svgoPlugins: [{ removeViewBox: false }],
          interlaced: true,
          optimizationLevel: 3, // 0 to 7
        })))
    .pipe(app.plugins.if(app.isBuild, app.gulp.dest(app.path.build.images))) //imagemin выгружаем
    .pipe(app.plugins.if(app.isBuild, app.gulp.src(app.path.src.images, { encoding: false })))// снова получаем изображения с исходника
    .pipe(app.plugins.if(app.isBuild, app.plugins.newer(app.path.build.images))) //прверка на обновления
    .pipe(app.plugins.if(app.isBuild, webp())) //webp создаем 
    .pipe(app.gulp.dest(app.path.build.images)) //webp выгружаем
    .pipe(app.gulp.src(app.path.src.svg))
    .pipe(app.gulp.dest(app.path.build.images))
    .pipe(app.plugins.browsersync.stream()); //обновляем браузер
}