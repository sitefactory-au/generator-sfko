// Node modules
var fs = require('fs'), vm = require('vm'), merge = require('deeply'), chalk = require('chalk'), es = require('event-stream');

// Gulp and plugins
var gulp = require('gulp'), rjs = require('gulp-requirejs-bundler'), concat = require('gulp-concat'), clean = require('gulp-clean'),
    replace = require('gulp-replace'), uglify = require('gulp-uglify'), htmlreplace = require('gulp-html-replace')<% if(usesTypeScript) { %>, typescript = require('gulp-tsc')<% } %><% if(usesLess) { %>, less = require('gulp-less')<% } %>;
var minifycss = require('gulp-minify-css');
var rename = require("gulp-rename");
var revall = require("gulp-rev-all");


// Config
var requireJsRuntimeConfig = vm.runInNewContext(fs.readFileSync('src/app/require.config.js') + '; require;');
    requireJsOptimizerConfig = merge(requireJsRuntimeConfig, {
        out: 'scripts.js',
        baseUrl: './src',
        name: 'app/startup',
        paths: {
            requireLib: 'bower_modules/requirejs/require'
        },
        include: [
            'requireLib',
            'components/nav-bar/nav-bar',
            'components/home-page/home-page',
            'text!components/about-page/about-page.html',
            // [Scaffolded component includes will be inserted here. To retain this feature, don't remove this comment.]
        ],
        insertRequire: ['app/startup'],
        bundles: {
            // If you want parts of the site to load on demand, remove them from the 'include' list
            // above, and group them into bundles here.
            // 'bundle-name': [ 'some/module', 'another/module' ],
            // 'another-bundle-name': [ 'yet-another-module' ]
        }
    });
<% if (usesTypeScript) { %>
// Compile all .ts files, producing .js and source map files alongside them
gulp.task('ts', function() {
    return gulp.src(['**/*.ts'])
        .pipe(typescript({
            module: 'amd',
            sourcemap: true,
            outDir: './'
        }))
        .pipe(gulp.dest('./'));
});
<% } %>
<% if (usesLess) { %>
// Compile all .less files, producing .css
gulp.task('less', function () {
    return gulp.src('./src/less/styles.less')
        .pipe(replace('url(../images/', 'url(images/'))
        .pipe(less())
        .pipe(replace("../../", ""))
        .pipe(minifycss())
        .pipe(rename('css.css'))
        .pipe(gulp.dest('./dist/'));
});
<% } %>
// Discovers all AMD dependencies, concatenates together all required .js files, minifies them
gulp.task('js', <% if (usesTypeScript) { %>['ts'], <% } %>function () {
    return rjs(requireJsOptimizerConfig)
        .pipe(uglify({ preserveComments: 'some' }))
        .pipe(gulp.dest('./dist/'));
});
<% if (!usesLess) { %>
// Concatenates CSS files, rewrites relative paths to Bootstrap fonts, copies Bootstrap fonts
gulp.task('css',  function () {
    var bowerCss = gulp.src(['src/bower_modules/components-bootstrap/css/bootstrap.min.css'])
            .pipe(replace(/url\((')?\.\.\/fonts\//g, 'url($1fonts/')),
        appCss = gulp.src('src/css/*.css'),
        combinedCss = es.concat(bowerCss, appCss).pipe(concat('css.css')),
        fontFiles = gulp.src('./src/bower_modules/components-bootstrap/fonts/*', { base: './src/bower_modules/components-bootstrap/' });
    return es.concat(combinedCss, fontFiles)
        .pipe(gulp.dest('./dist/'));
});
<% } %>
// Copies index.html, replacing <script> and <link> tags to reference production URLs
gulp.task('html', function() {
    return gulp.src('./src/index.html')
        .pipe(htmlreplace({
            'css': 'css.css',
            'js': 'scripts.js'
        }))
        .pipe(gulp.dest('./dist/'));
});
<% if (!usesTypeScript) { %>
// Removes all files from ./dist & ./final
gulp.task('clean', function() {
    return gulp.src(['./dist','./final'], { read: false })
        .pipe(clean());
});
<% } else { %>
// Removes all files from ./dist/, and the .js/.js.map files compiled from .ts
gulp.task('clean', function() {
    var distContents = gulp.src('./dist/**/*', { read: false }),
        generatedJs = gulp.src(['src/**/*.js', 'src/**/*.js.map'<% if(includeTests) { %>, 'test/**/*.js', 'test/**/*.js.map'<% } %>], { read: false })
            .pipe(es.mapSync(function(data) {
                // Include only the .js/.js.map files that correspond to a .ts file
                return fs.existsSync(data.path.replace(/\.js(\.map)?$/, '.ts')) ? data : undefined;
            }));
	var finalContents = gulp.src('./final', {read:false});
    return es.merge(distContents, generatedJs, finalContents).pipe(clean());
});
<% } %>

// Copy all static images
gulp.task('images', function() {
  return gulp.src('./src/images/**/*.*')
    .pipe(gulp.dest('./dist/images'));
});

<% if (!usesLess) { %>
gulp.task('default', ['images', 'html', 'js',  'css' ], function(callback) {
<% } else { %>
gulp.task('default', ['images', 'html', 'js',  'less' ], function(callback) {
<% } %>
    gulp.src('dist/**')
      .pipe(revall({ ignore: [/^\/favicon.ico$/g, '.html'] }))
      .pipe(gulp.dest('./final'));
    callback();
    console.log('\nPlaced optimized files in ' + chalk.magenta('dist/\n'));
});
