# Veeva CLM Base Repo
This is a base app template build for the Veeva CRM platform.  This will compile all slides AND build the packages for upload to the Veeva platform for you (see gulp commands below).


## Requirements

* NodeJS
* npm
    * Use **NVM** for your node versioning
        * nvm install 11.15
        * nvm use 11.15
* Gulp v4.0 -- recommended to be installed globally
    * `sudo npm install --global gulp`

# Setup

`npm install`

## Prepare gulpfile.babel.js
The build process requires certain data to work correctly.  In the gulpfule.babel.js file, replace the following data (all marked with "// ## REPLACE"):

* Zips - replace with the name of the slides being created
* external_id__v: - replace with the name of the presentation for access with gotoSlide() and other functionality
* name__v: - replace with the name of the presentation 
* pres.product__v.name__v: - replace with the product associated with this CLM content
* presentation_link: - replace with the name of the presentation for access with gotoSlide() and other functionality

## Prepare src code
For each slide created you must have the appropriately sized .png file in the src/assets/thumbs directory.  This project also has base css/js to get started, update accordingly.  It also contains base IVA elements like header, isi and overlays in the src/partials directory. The src/slides directory is where each .pug file per slide is created that extend the template in src/templates

## How to run locally

`php -S 0.0.0.0:8081`

All slides will work locally, however the following functionality will not working locally because it requires Veeva specific JS functionality:
- Navigation
- Any buttons that link to a different slide

When testing any changes to any of the above, you must update the code, compile it, push to Vault, sync to the CRM and test on the device or the device simulator. 

## Gulp Commands

- `gulp` this will run the *default task* which is to build the entire project into the build directory. This will also run the task createRecords which populates the **veeva_multichannel_loader.csv** file with information about all slides (this file is needed for the Vault upload)

  *Note: This will run the following tasks: clean, pugFiles, styles, scripts, pdf, data, video, pdf, images, fonts, createRecords*

- `gulp clean` this deletes all files in the build folder and the build/vault-assets folder (except zip.sh, veeva_multichannel_loader.csv and .gitkeep)

- `gulp watch` this will watch all pug files, js files, scss files, images, data and fonts for any changes and recompile upon change.


# How to upload presentation using Veeva Vault
1. Compile all assets with `gulp`
2. Navigate to the `build/` folder and run `sh zip.sh` this will zip up all files for vault upload.
3. Login to Veeva Vault.
4. Click on **Multichannel Loader**
5. Upload the **veeva_multichannel_loader.csv** file.  Veeva will tell you if there are any errors on your csv file.  If there are errors, fix them and reupload the file. If there are no errors click **next** in the top right corner.
6. Upload zip files for all slides and global-assets_2021.  (DO NOT UPLOAD THE **shared.zip**, that is for local use only). Below the upload box you will see a list of all zip files Veeva is expecting.  If any of the zip files you upload are wrong, Veeva will show that there is an error, and it is most likely a packaging error.  This usually means the names of your html file, pdf file, thumbnail file, or full size image file are wrong.  It can also mean that you have zipped the files incorrectly, however if you followed step 3 this will NOT be the issue. Once all errors have been fixed and uploaded again, click **next** in the top right corner.
7. Veeva will confirm that you are either creating or updating a presentation and slides.  It will count how many slides you are updating or uploading (make sure this matches how many you expect to be uploaded).  It will also tell you how many shared folders are being updated or created. Once you've verified that this is correct, click **next** in the top right corner.
8. Veeva will tell you that you need to stay logged in and that they will email you when the upload is complete.  This usually takes about 5 minutes.
9. Once you receive the email, navigate to **Library**.
10. You will see the "Binder" you just uploaded, click on it.
11. Within the binder you will see all slides associated with the presentation.
12. Above the list of slides within the presentation, click on the 3 dots icon, select **PERFORM BULK ACTION**.
13. On the next screen, click **next**.
14. Select **Edit Document Fields > Edit Fields** and then click **next**
15. Scroll down to the section **External Viewer**. Edit **Allow PDF Download**, make sure nothing is selected.
16. Click **next**
17. Review changes you are making. If all are correct, click **Finish**.
18. When this is done, you will receive an email saying the bulk action has been completed.
19. Once all of these things are done, click on **CRM Publishing**
20. Select **W2O** with the integration **CLM**
21. Click **Publish to CRM**, then click continue in the popup.
22. Once the sync is done, Veeva will send you an email. (should take about 5 minutes)
23. Once you receive the email, login to **test.salesforce.com** using the **cloader**. Navigate to the **CLM Admin** tab.  If the sync had any errors, the first item in the list will show as Failed and you can click the number in the **failed** column to download a csv with more information.  If it didn't fail it will say **success**.
24. Navigate to **CLM Presentations**, once there, next to the dropdown at the top click the **go** button to see all presentations.  Look for the one you just uploaded and check to make sure everything is correct.
25. Click **Clear Veeva Cache** in the top navigation. Once that is complete you can login to Veeva on an iPad or using Simulator and sync to see the content.


# Template - Guidelines

## Global Assets

This should be the global assets, functionality, and styling for the presentation.

**NOTE: when including any of the following assets within a slide you MUST follow the following structure `../shared/global-assets_2021/<file type (images, js, styles)>/<filename>`.  Although we are not using a folder called "shared", Veeva automatically packages shared assets in an outer folder called "shared", therefore you must always reference it.**

**If you are referencing a GLOBAL image within a scss file you reference it like this: `../images/dropdown_background_new.png`**

### SCSS/CSS:

All styles are compiled into `global-assets_2021/styles/styles.css`

NOTE: style.scss pulls in all other scss files.  We do not need individual style files for each slide, we use global styling.  There are **no** slide specific style sheets, all styles are loaded using global-assets_2021.

### JavaScript:

All global JS lives within `global-assets_2021/js/`.  See slide specific JS information in the **"Slide specific assets"** section below.

The Veeva JS library `src/assets/js/lib/veeva.js` and jQuery `src/assets/js/lib/jquery-3.1.1.min.js` are both located in the **/lib** folder.  jQuery will be compiled as a separate file and is included in the template for every slide. The Veeva library is compiled into the main.min.js file.

All other JavaScript files (all files under **/js/components**, **/js/global.js**, and **js/init.js**) are compiled into `src/assets/js/main.min.js`.

**NOTE:** JS files within the components folder are "initialized" within the init.js file depending on the class name on the body element of the slide.  For example: if the body class is "coverage", then the coverage.js file is loaded on that page.  For any questions regarding the JS structure and setup please contact Kelly Mersereau.

### Images:

All global images live within `src/assets/images/global/`.  This folder should contain only images that are used globally throughout the presentation.  These images will be moved to `global-assets_2021/images/` once you run gulp.

### Fonts:

All fonts are global and live within `src/assets/fonts/`.  These fonts will be moved to `global-assets_2021/fonts/` once you run gulp.

## Slide specific assets

### JavaScript
Slide specific libraries are compiled as separate files and need to be included in that specific slide.  You do this by marking **extra_js = true** in **block vars** at the top of the slide and including the js files in **block extra_js_code** at the bottom of the page.  These libraries will **NOT** live within the global-assets folder, they will live within the slide folder they are used on. We do not have any slides that utilize this at the moment.

**If you are adding a new JS file that is slide specific, you MUST update the gulpfile to move this file to the correct slide folder.  Ask Kelly for help with this or look at the gulpfile for how this is done with Managed Card and Metabolism slides**

### Images

If an image is only used on one specific slide, please create a folder within `src/assets/images/` with the exact slide name and place all images for that slide within that folder.  These images will be compiled into that specific slide's `/assets/images` folder.

# Setting up a new Slide

All slides, folders, and files should be named as the description of the slide, this is **extremely important**.
This is per slide assets, functionality, and styling

**Example:** `patients_children`

**PUG:**

`src/pages/patients_children.pug`

**Images:**

`src/assets/images/patients_children/image.png`

Note: this individual folder is only necessary if the slide has **slide specific** image assets

**Thumbnails**

`src/assets/thumbs/patients_children-thumb.png`

**NOTE:** All slides are required to  have both a full size image (1024x768) and a thumbnail size image (195x147). You must save thumbnails and full size images as png files. It is vital that the names of these files match the pug/html file name **EXACTLY**.

### SRC: Directory and File Structure

* _src_
    * _assets_
        * _fonts_
        * _images_
            * _global_: global images
            * _slide-name_: contains slide images
        * _js_
            * _components_: task specific JavaScript
                * **animation.js** - all animation related js
                * **isi.js** - js for the isi functionality (this is initialized on all slides)
                * **modals.js** - js for modal functionality (this is initialized on all slides)
                * **tabs.js** - js for all slides that are tabbed
            * _lib_: 3rd party libraries used
                * jquery-3.1.1.min.js
                * veeva.js
            * **init.js** - initializes all JS in the components folder
            * **global.js** - global js that should be used on all slides
        * _scss_
            * _base_ - folder containing global styling
            * _components_ - folder containing element specific styling
            * **style.scss** - this pulls in all other scss files
        * _thumbs_: contains all **thumbnail** and **full** sized images for each slide (jpg & png)
    * _partials_
        * _modals_: contains all individual modal pug files
        * isi.pug
        * nav.pug
    * _pdfs_
        * Contains PDF files that are to be slides within the presentation
    * _slides_: Contains pug files for each individual slide
    * _svgs_: contains SVGs to be included within the pug files.  Kept as svg code, not images, for animation purposes.
    * _templates_
        * **base.pug**: base template for all slides


### Slide Naming Conventions
Do not change the names of any of the slides unless ABSOLUTELY necessary.  If for some reason, you must change the name of a slide, you **MUST** also change the name of the slide where it is referenced in the javascript and in the gulpfile, as well as update the name of the thumbnails, full size images and image folders.  