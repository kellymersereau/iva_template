/*
 INSTRUCTIONS FOR USE:

 This file should be used if you are creating a presentation for Engage Meeting for use on Windows devices OR Engage for Portals.

 1. Run "gulp" to compile all assets into the zips directory
 2. IF YOU ARE UPLOADING VIA VAULT:
 - only use the assets within the "build" folder inside build
 - the GULP command will create all the folders within the build directory and will update the multichannel_loader.csv file

 If you have any questions contact Kelly Mersereau before making any changes to the gulp file or uploading any of the wrong content to vault. :)

 NOTE: This does NOT use shared assets. All styles, images and JS are compiled into each individual slide's folder. If you are using this gulpfile, you MUST update the template to reference the assets locally (i.e. ./images/image.png or ./js/main.min.js).  You must also make sure none of the code is looking for the global assets folder.

 */

const gulp        = require('gulp'),
	gutil           = require('gulp-util'),
	sass            = require('gulp-sass')(require('sass')),
	concat          = require('gulp-concat'),
	uglify          = require('gulp-uglify'),
	autoprefixer    = require('gulp-autoprefixer'),
	cleanCSS        = require('gulp-clean-css'),
	rename          = require('gulp-rename'),
	pug             = require('gulp-pug'),
	plumber         = require('gulp-plumber'),
	sourcemaps      = require('gulp-sourcemaps'),
	del             = require('del'),
	terser          = require('gulp-terser'),
	createCsvWriter = require('csv-writer').createObjectCsvWriter,


	/**
	 * Remove demo names below and update with the appropriate slide file names and slide names (names that will show on the thumbnails in the swimlane within the Veeva application) from the provided matrix. This is critical for the build process
	 * @type {string[]}
	 */
		// ## REPLACE
	zips  = [
		{
			'name':'home_slide',
			'title':'Home'
		}
	],
	pdfs  = [
		{
			'name':'test_pdf_slide',
			'title': 'PDF'
		}
	],
	csvWriter = createCsvWriter({
		path: './build/veeva_multichannel_loader.csv',
		header: [
			// leave this blank if first time uploading to veeva vault, if you are updating files on veeva vault use the document id specified in vault
			{id: 'document_id__v', title: 'document_id__v'},
			// Standard External ID document field
			{id: 'external_id__v', title: 'external_id__v'},
			// Name document field
			{id: 'name__v', title: 'name__v'},
			// Set to "FALSE"
			{id: 'create_presentation', title: 'Create Presentation'},
			// Specifies the kind of document. Presentation line will be Presentation.  Slides will be Slides. Shared assets will be "Shared"
			{id: 'type', title: 'Type'},
			// Name of the slide or presentation lifecycle.  Presentations will be marked as "Binder Lifecycle", Slides will be marked as "CRM Content Lifecycle"
			{id: 'lifecycle__v', title: 'lifecycle__v'},
			// 	Indicates the presentation that the slide belongs to, using the External ID value or document ID of the presentation - NOTE: If it is a shared asset this needs to be blank
			{id: 'presentation_link', title: 'Presentation Link'},
			// Indicates whether the loader should only update fields, or also upload a new ZIP distribution package; if there are only field updates, enter Yes or True. If there is a new file to upload, enter No or False.
			{id: 'fields_only', title: 'Fields Only'},
			// Populate with name of presentation (EXACT NAME OF ZIP), leave blank for slides
			{id:'pres.title__v', title:'pres.title__v'},
			// Populate with name of presentation (EXACT NAME OF ZIP), leave blank for slides
			{id:'pres.presentation_id__v', title:'pres.presentation_id__v'},
			// Set to FALSE - only fill in for Presentation NOT Slides and only when the presentation is being used for training purposes
			{id: 'pres.crm_training__v', title: 'pres.crm_training__v'},
			// Set to FALSE - only fill in for Presentation NOT Slides and only when you want the presentation to be hidden
			{id: 'pres.crm_hidden__v', title: 'pres.crm_hidden__v'},
			// Name of Product associated with this presentation - only fill in for Presentation NOT Slides
			{id: 'pres.product__v.name__v', title: 'pres.product__v.name__v'},
			// Name of Country associated with this presentation - United States - only fill in for Presentation NOT Slides
			{id: 'pres.country__v.name__v', title: 'pres.country__v.name__v'},
			// Start date of presentation (should use the date of first upload, I think) - only fill in for Presentation NOT Slides
			{id: 'pres.crm_start_date__v', title: 'pres.crm_start_date__v'},
			// End date of presentation (should use the date of first upload PLUS one year, I think) - only fill in for Presentation NOT Slides
			{id: 'pres.crm_end_date__v', title: 'pres.crm_end_date__v'},
			// Populate with Yes for Presentation and leave blank for slides
			{id: 'pres.clm_content__v', title: 'pres.clm_content__v'},
			// Leave Blank
			{id: 'slide.name__v', title: 'slide.name__v'},
			// Leave Blank
			{id: 'slide.lifecycle__v', title: 'slide.lifecycle__v'},
			// For Presentation, leave blank.  For slides, set to "HTML"
			{id: 'slide.crm_media_type__v', title: 'slide.crm_media_type__v'},
			// Leave Blank
			{id: 'slide.related_sub_pres__v', title: 'slide.related_sub_pres__v'},
			// If slide is using a shared resource, enter the EXTERNAL ID of the shared resource otherwise, leave blank
			{id: 'slide.related_shared_resource__v', title: 'slide.related_shared_resource__v'},
			// Actions to be disabled by default on the slides.  Presentation, leave blank.  Slides, use "Zoom"
			{id: 'slide.crm_disable_actions__v', title: 'slide.crm_disable_actions__v'},
			// Set iOS Resolution for the slides.  Presentation, leave blank.  Slides, use "Default For Device"
			{id: 'slide.ios_resolution__v', title: 'slide.ios_resolution__v'},
			// Sets the CLM content for the presentation and slides.  Presentation, use "Yes".  Slides, use "Yes"
			{id: 'slide.clm_content__v', title: 'slide.clm_content__v'},
			// Product name for slides - should be same as presentation product name
			{id: 'slide.product__v.name__v', title: 'slide.product__v.name__v'},
			// Country name for slides - should be same as presentation country name
			{id: 'slide.country__v.name__v', title: 'slide.country__v.name__v'},
			// Name of zip file for SLIDES ONLY - presentation leave blank
			{id: 'slide.filename', title: 'slide.filename'},
			// If you have a shared resource, this should be true for THAT LINE ONLY - everything else should be blank
			{id: 'slide.crm_shared_resource__v', title: 'slide.crm_shared_resource__v'}
		]
	}),
	presentationRecord = [
		{
			document_id__v: '',
			external_id__v: 'NAME_OF_PRESENTATION',  // ## REPLACE
			name__v: 'NAME_OF_PRESENTATION',  // ## REPLACE
			create_presentation: 'FALSE',
			type: 'Presentation',
			lifecycle__v: 'Binder Lifecycle',
			presentation_link: '',
			fields_only: 'FALSE',
			'pres.title__v': 'NAME_OF_PRESENTATION', // ## REPLACE
			'pres.presentation_id__v': 'NAME_OF_PRESENTATION', // ## REPLACE
			'pres.crm_training__v': 'No',
			'pres.crm_hidden__v': 'No',
			'pres.product__v.name__v': 'PRODUCT',  // ## REPLACE
			'pres.country__v.name__v': 'United States',
			'pres.crm_start_date__v': '',
			'pres.crm_end_date__v': '',
			'pres.clm_content__v': 'Yes',
			'slide.name__v': '',
			'slide.title__v': '',
			'slide.lifecycle__v': '',
			'slide.crm_media_type__v': '',
			'slide.related_sub_pres__v': '',
			'slide.related_shared_resource__v': '',
			'slide.crm_disable_actions__v': '',
			'slide.ios_resolution__v': '',
			'slide.clm_content__v': '',
			'slide.product__v.name__v': '',
			'slide.country__v.name__v': '',
			'slide.filename': '',
			'slide.crm_shared_resource__v': ''
		}
	];

/*
 * CLEAN OUTPUT DIRECTORY...
 */
function clean(){
	return new Promise(function(resolve, reject) {
		console.log('CLEAN STARTED!');
		del.sync(['build/**', '!build', '!build/.gitkeep',
			'!build/zip.sh', '!build/veeva_multichannel_loader.csv'])
		console.log('CLEAN COMPLETED!');
		resolve();
	});
}

/*
 * HTML BUILD...
 This loops through the zips array, finds a pug file of the same name as the index position, then spits it out as a minified html in a folder with the same directory & name as the index position
 */
function pugFiles(){
	return new Promise(function(resolve, reject) {
		console.log('PUG/HTML STARTED!');
		zips.map(function (zip) {
			console.log('BUILDING ', zip);
			// SALESFORCE
			gulp.src(['src/slides/' + zip + '.pug'])
			.pipe(pug({
				pretty:true,
				locals:{}
			}).on('error', gutil.log))
			.pipe(rename('index.html').on('error', gutil.log))
			.pipe(gulp.dest('build/'+zip+'/' ));
			console.log('FINISHED ', zip);
		})

		console.log('PUG/HTML COMPLETED!');
		resolve();
	});
}

/*
 * CSS BUILD...
 This loops through the zips array, finds a scss file of the same name as the index position, then spits it out as css in a folder with the same directory & name as the index position
 */
function styles(){
	return new Promise(function(resolve, reject) {
		console.log('STYLES STARTED!');
		zips.map(function (zip) {
			console.log('BUILDING STYLES FOR ', zip);
			gulp.src(['src/assets/scss/styles.scss'])
			.pipe(sourcemaps.init())
			.pipe(sass({
				precision: 10
			}).on('error', sass.logError))
			.pipe(autoprefixer('last 8 version'))
			.pipe(cleanCSS())
			.pipe(sourcemaps.write('./'))
			.pipe(gulp.dest('build/'+zip+'/styles/' ));
			console.log('FINISHED STYLES FOR ', zip);
		})
		console.log('CSS COMPLETED!');
		resolve();
	});
}

/*
 * JAVASCRIPT BUILD...
 */
function scripts(){
	return new Promise(function(resolve, reject) {
		console.log("JAVASCRIPT STARTED!");
		zips.map(function (zip) {
			console.log('BUILDING JS FOR ', zip);
			gulp.src([
				'./src/assets/js/lib/veeva.js',
				'./src/assets/js/components/tabs.js',
				'./src/assets/js/components/isi.js',
				'./src/assets/js/components/modals.js',
				'./src/assets/js/global.js',
				'./src/assets/js/init.js'
			])
			.pipe(sourcemaps.init())
			.pipe(plumber())
			.pipe(terser())
			.pipe(sourcemaps.write())
			.pipe(concat('main.min.js'))
			.pipe(sourcemaps.write('.'))
			.pipe(gulp.dest('build/'+zip+'/js/' ));
			gulp.src('./src/assets/js/lib/jquery-3.1.1.min.js',)
			.pipe(plumber())
			.pipe(uglify())
			.pipe(gulp.dest('build/'+zip+'/js/' ));
			console.log('FINISHED JS FOR ', zip);
		})
		console.log("JAVASCRIPT COMPLETED!");
		resolve();
	});
}

/*
 * PDF BUILD...
 */
function pdf(){
	return new Promise(function(resolve, reject) {
		console.log('PDF STARTED!');
		pdfs.map(function (pdf) {
			console.log('BUILDING ', pdf.name);
			gulp.src(['src/pdfs/' + pdf.name + '.pdf'])
				// VAULT
				.pipe(rename('pdf.pdf').on('error', gutil.log))
				.pipe(gulp.dest('build/'+pdf.name+'/' ));
		});

		console.log('PDF COMPLETED!');
		resolve();
	});
}

/*
 * MOVE IMAGES (including thumb images )...
 */
function images(){
	return new Promise(function(resolve, reject) {
		console.log('IMAGES STARTED!');
		zips.map(function (zip) {
			console.log('BUILDING ', zip);
			gulp.src('src/assets/images/global/**/*')
				.pipe(gulp.dest('build/'+ zip +'/images/'))
			gulp.src('src/assets/images/' + zip + '/**/*')
				// FOR VAULT & LOCAL USE
				.pipe(gulp.dest('build/'+ zip +'/images'))

			// VAULT
			gulp.src('src/assets/thumbs/'  + zip + '-thumb.png')
			.pipe(rename('thumb.png').on('error', gutil.log))
			.pipe(gulp.dest('build/'+ zip));
		});
		console.log('IMAGES COMPLETED!');
		resolve();
	});
}

/*
 * MOVE FONTS TO GLOBAL ASSETS...
 */
function fonts(){
	return new Promise(function(resolve, reject) {
		console.log('FONTS STARTED!');
		zips.map(function (zip) {
			console.log('BUILDING JS FOR ', zip);
			gulp.src('src/assets/fonts/**/*')
			.pipe(gulp.dest('build/'+zip+'/fonts/' ));
			console.log('FINISHED JS FOR ', zip);
		})
		console.log('FONTS COMPLETED!');
		resolve();
	});
}

/*
 * MAKE CSV FILE FOR VAULT UPLOAD
 */
function compileRecords(){
	let newZipArray = zips.map(function (zip) {
		return {
			document_id__v: '',
			external_id__v: zip.name,
			name__v: zip.name,
			create_presentation: 'FALSE',
			type: 'Slide',
			lifecycle__v: 'CRM Content Lifecycle',
			presentation_link: 'NAME_OF_PRESENTATION',   // ## REPLACE
			fields_only: 'FALSE',
			'pres.title__v': '',
			'pres.presentation_id__v': '',
			'pres.crm_training__v': '',
			'pres.crm_hidden__v': '',
			'pres.product__v.name__v': '',
			'pres.country__v.name__v': '',
			'pres.crm_start_date__v': '',
			'pres.crm_end_date__v': '',
			'pres.clm_content__v': '',
			'slide.name__v': '',
			'slide.title__v': zip.title,
			'slide.lifecycle__v': '',
			'slide.crm_media_type__v': 'HTML',
			'slide.related_sub_pres__v': '',
			'slide.related_shared_resource__v': '',
			'slide.crm_disable_actions__v': 'Zoom', // ## REPLACE
			'slide.ios_resolution__v': 'Default for Device', // DO NOT CHANGE
			'slide.clm_content__v': 'Yes',
			'slide.product__v.name__v': 'PRODUCT_NAME', //## REPLACE
			'slide.country__v.name__v': 'United States',
			'slide.filename': zip.name + '.zip',
			'slide.crm_shared_resource__v': ''
		};
	});
	for ( var i = 0; i < newZipArray.length; i++){
		presentationRecord.push(newZipArray[i]);
	}
	let newPdfArray = pdfs.map(function (pdf) {
		return {
			document_id__v: '',
			external_id__v: pdf.name,
			name__v: pdf.name,
			create_presentation: 'FALSE',
			type: 'Slide',
			lifecycle__v: 'CRM Content Lifecycle',
			presentation_link: 'NAME_OF_PRESENTATION',   // ## REPLACE
			fields_only: 'FALSE',
			'pres.title__v': '',
			'pres.presentation_id__v': '',
			'pres.crm_training__v': '',
			'pres.crm_hidden__v': '',
			'pres.product__v.name__v': '',
			'pres.country__v.name__v': '',
			'pres.crm_start_date__v': '',
			'pres.crm_end_date__v': '',
			'pres.clm_content__v': '',
			'slide.name__v': '',
			'slide.title__v': pdf.title,
			'slide.lifecycle__v': '',
			'slide.crm_media_type__v': 'PDF',
			'slide.related_sub_pres__v': '',
			'slide.related_shared_resource__v': '',
			'slide.crm_disable_actions__v': 'Zoom', // ## REPLACE
			'slide.ios_resolution__v': 'Default for Device', // DO NOT CHANGE
			'slide.clm_content__v': 'Yes',
			'slide.product__v.name__v': 'PRODUCT_NAME', //## REPLACE
			'slide.country__v.name__v': 'United States',
			'slide.filename': pdf.name + '.zip',
			'slide.crm_shared_resource__v': ''
		};
	});
	for ( var i = 0; i < newPdfArray.length; i++){
		presentationRecord.push(newPdfArray[i]);
	}
}
function createRecords(){
	compileRecords();

	return new Promise(function (resolve,  reject){
		csvWriter.writeRecords(presentationRecord)       // returns a promise
			.then(() => {
				console.log('...Done with presentation');
			});
		resolve();
	});
}

function watch(){
	return new Promise(function(resolve, reject) {
		gulp.watch('./src/pdfs/*.pdf', pdf);
		gulp.watch('./src/slides/*.pug', pugFiles);
		gulp.watch('./src/partials/**/*.pug', pugFiles);
		gulp.watch('./src/templates/*.pug', pugFiles);
		gulp.watch('./src/svgs/*.svg', pugFiles);
		gulp.watch('./src/assets/scss/**/*.scss', styles);
		gulp.watch('./src/assets/js/**/*.js', scripts);
		gulp.watch('./src/assets/images/**/**/*.png', images);
		gulp.watch('./src/assets/images/**/**/*.jpg', images);
		gulp.watch('./src/assets/images/**/**/*.svg', images);
		gulp.watch('./src/assets/thumbs/*.png', images);
		gulp.watch('./src/assets/fonts/*.ttf', fonts);
		gulp.watch('./src/assets/fonts/*.otf', fonts);
		resolve();
	});
}

exports.clean         = clean;
exports.pug           = pugFiles;
exports.styles        = styles;
exports.scripts       = scripts;
exports.pdf						= pdf;
exports.images        = images;
exports.fonts         = fonts;
exports.createRecords = createRecords;
exports.watch         = watch;

/*
 * MUST USE THIS TO BUILD FOR VAULT - includes build of vault csv file
 */
let build = gulp.series(gulp.parallel(clean, pugFiles, styles, scripts, pdf,  images, fonts, createRecords));

gulp.task('default', build);


/*
 * WATCH
 */
gulp.task('watch', watch);