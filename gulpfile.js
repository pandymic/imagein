const gulp = require( 'gulp' ),
  log = require( 'fancy-log' ),
  plumber = require('gulp-plumber'),
  sass = require('gulp-sass')( require('sass') ),
  shell = require( 'child_process' ).exec,
  uglify = require('gulp-uglify');

gulp.task( 'dist', () => {
  return gulp.src( [
    './src/**/*',
    '!./src/imagein/*.js',
    '!./src/imagein/*.scss',
    '!./src/**/*.md',
    '!./src/**/.gitignore'
  ] )
    .pipe( gulp.dest( './dist' ) );
} );

gulp.task( 'style', () => {
  return gulp.src( './src/imagein/*.scss' )
    .pipe( plumber() )
    .pipe( sass( {
      outputStyle: 'compressed',
      functions: {
        // Base64 encode strings for data url's within sass files.
        'btoa($string)': function(string) {
          string.setValue( Buffer.from( string.getValue() ).toString( 'base64' ) );
          return string;
        }
      }
    } ) )
    .pipe( gulp.dest( './dist/imagein' ) );
});

gulp.task( 'script', () => {
  return gulp.src( './src/imagein/*.js' )
    .pipe( plumber() )
    .pipe( uglify() )
    .pipe( gulp.dest( './dist/imagein' ) );
});

gulp.task( 'permissions', ( callback ) => {
  shell( 'cd ./dist && find . -user $USER -not -group apache -exec chgrp apache {} \\;', ( err, stdout, stderr ) => {
    log.info( 'File group updated...' );
    if ( stdout.length ) log( stdout.trim() );
    if ( stderr.length ) log.error( stderr.trim() );
    callback( err );
  } );
} );

gulp.task( 'watch', () => {
  gulp.watch( './src/**/*', gulp.series( 'default' ) );
} );

gulp.task( 'default', gulp.series( 'dist', 'style', 'script', 'permissions' ) );